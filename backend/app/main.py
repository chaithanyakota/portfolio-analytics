from fastapi import FastAPI

app = FastAPI(title="Portfolio Analytics API") # create FastAPI app instance

@app.get("/") # register a REST endpoint
def root(): 
    return {"message": "portfolio-analytics API running"}

@app.get("/health") # register a health check endpoint
def health():
    return {"status": "ok"}