import express from 'express';
import cors from 'cors';
import { Request, Response } from 'express';

// Types for our API
interface AnalyzeCodeRequest {
  code: string;
  language?: string;
}

interface AnalysisResult {
  complexity: string;
  suggestions: string[];
  metrics: {
    lines: number;
    functions: number;
    loops: number;
  };
}