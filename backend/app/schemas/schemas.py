from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "patient"

class VitalRecordCreate(BaseModel):
    patient_id: str
    heart_rate: float
    systolic_bp: float
    diastolic_bp: float
    blood_glucose: Optional[float] = None
    spo2: float
    body_temperature: Optional[float] = 36.6
    respiratory_rate: Optional[float] = 16.0
    activity_level: Optional[str] = "Moderate"
    sleep_hours: Optional[float] = 7.0
    stress_level: Optional[int] = 3
    symptoms: Optional[str] = None
    notes: Optional[str] = None

class VitalAnalysisRequest(BaseModel):
    current_vitals: Dict[str, Any]
    historical_vitals: Optional[List[Dict[str, Any]]] = []
    patient_profile: Optional[Dict[str, Any]] = {}

class AlertAcknowledgeRequest(BaseModel):
    acknowledged_by: Optional[str] = None

class ClinicalNoteCreate(BaseModel):
    patient_id: str
    note: str
    priority: Optional[str] = "Normal"

class SimulationTickRequest(BaseModel):
    patient_key: str = "patient_1"
    step: int = 0
