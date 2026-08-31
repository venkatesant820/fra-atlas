#!/bin/bash
cd backend
python -m pip install -r ../requirements.txt || true
python -m pip install uvicorn fastapi pydantic paddleocr scikit-learn requests || true
python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
