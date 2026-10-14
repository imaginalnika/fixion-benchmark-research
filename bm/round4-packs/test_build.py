"""Importer regression fixtures, never model outputs or sample-pack content."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location('pack_builder', Path(__file__).with_name('build.py'))
BUILDER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(BUILDER)


class ImporterTests(unittest.TestCase):
    def setUp(self):
        self.original = BUILDER.originals()
        prompt = self.original['JP045']['prompt']
        self.row = {
            'strategy': {'id': 'proxy_beta_015', 'name': 'proxy', 'params': {'scale': .15}},
            'prompt_id': 'JP045', 'prompt': prompt, 'prompt_sha256': BUILDER.sha(prompt),
            'text': 'TEST FIXTURE ONLY\u2028line separator\u2029paragraph separator\n  <special>  ',
            'token_ids': [101, 102], 'sampling': {'temperature': 1, 'top_p': 1, 'top_k': 0},
            'models': {'backend': 'hf_pair', 'synthetic': False, 'models': {
                'base': {'model_id': 'writer-fixture'}, 'instruct': {'model_id': 'instruct-fixture'}}},
            'reference_model': {'model_id': 'reference-base-fixture', 'requested_revision': 'fixture'},
            'max_new_tokens': 128, 'repeat': 2, 'finish_reason': 'eos', 'seed': 42,
            'backend': 'hf', 'synthetic': False, 'status': 'complete', 'job_id': 'fixture-job', 'run_id': 'fixture-run',
        }
        self.row['text_sha256'] = BUILDER.sha(self.row['text'])

    def read(self, rows):
        with tempfile.TemporaryDirectory(prefix='pack-import-test-') as tmp:
            path = Path(tmp) / 'test.jsonl'
            path.write_text('\n'.join(json.dumps(r, ensure_ascii=False) for r in rows) + '\n', encoding='utf-8')
            return BUILDER.import_runs([path], self.original, {'proxy'})

    def test_physical_jsonl_unicode_variant_roles_and_runner_fields(self):
        records = self.read([self.row, dict(self.row, job_id='fixture-job-2', repeat=3)])
        self.assertEqual(len(records), 2)
        first = records[0]
        self.assertEqual(first['text'], self.row['text'])
        self.assertEqual(first['prompt'], self.row['prompt'])
        self.assertEqual(first['source']['line'], 1)
        self.assertEqual(records[1]['source']['line'], 2)
        self.assertEqual(first['strategy_id'], 'proxy')
        self.assertEqual(first['arm'], 'proxy_beta_015')
        self.assertEqual(first['parameters'], {'scale': .15})
        self.assertEqual(first['max_tokens'], 128)
        self.assertEqual(first['replicate'], 2)
        self.assertEqual(first['job_id'], 'fixture-job')
        self.assertEqual(first['models'], {'writer': 'writer-fixture', 'correction_instruct': 'instruct-fixture', 'correction_base': 'reference-base-fixture'})
        self.assertEqual(first['model_metadata'], self.row['models'])
        self.assertEqual(first['reference_model'], self.row['reference_model'])
        self.assertEqual(first['text_bytes'], len(self.row['text'].encode('utf-8')))

    def test_synthetic_toy_and_unmarked_records_rejected(self):
        for extra in ({'synthetic': True}, {'backend': 'toy'}, {'synthetic': None}):
            with self.subTest(extra=extra), self.assertRaises(ValueError):
                self.read([dict(self.row, **extra)])

    def test_prompt_edits_or_forged_hashes_rejected(self):
        for extra in ({'prompt': self.row['prompt'] + ' '}, {'prompt_sha256': 'wrong'}, {'text_sha256': 'wrong'}):
            with self.subTest(extra=extra), self.assertRaises(AssertionError):
                self.read([dict(self.row, **extra)])

    def test_failed_records_are_not_continuations(self):
        self.assertEqual(self.read([dict(self.row, status='failed')]), [])

    def test_unknown_strategy_rejected(self):
        with self.assertRaises(AssertionError):
            self.read([dict(self.row, strategy={'id': 'fixture', 'name': 'unknown'})])


if __name__ == '__main__':
    unittest.main()
