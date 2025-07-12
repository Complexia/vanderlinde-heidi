def main():
    print("Hello from vanderlinde-backend!")

from fastapi import FastAPI
from app.api.routes import router as consultation_router

app = FastAPI()
app.include_router(consultation_router, prefix="/consultation")

if __name__ == "__main__":
    main()
