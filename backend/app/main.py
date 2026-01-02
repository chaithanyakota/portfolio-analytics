from fastapi import FastAPI

app = FastAPI() # create FastAPI app instance

@app.get("/") # register a REST endpoint
def health_check(): 
    return {"status": "ok"}