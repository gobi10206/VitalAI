import io
from datetime import datetime, timezone
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from typing import Dict, List, Any

def generate_patient_health_report(patient: Dict[str, Any], vitals: List[Dict[str, Any]], assessment: Dict[str, Any], alerts: List[Dict[str, Any]]) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    header_style = ParagraphStyle('H1', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=20, leading=24, textColor=colors.HexColor('#0f766e'))
    sub_style = ParagraphStyle('Sub', parent=styles['Normal'], fontName='Helvetica', fontSize=10, leading=14, textColor=colors.HexColor('#475569'))
    sec_style = ParagraphStyle('Sec', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=12, leading=16, textColor=colors.HexColor('#0f172a'), spaceBefore=10, spaceAfter=4)
    body_style = ParagraphStyle('Body', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=12, textColor=colors.HexColor('#1e293b'))
    disclaimer_style = ParagraphStyle('Disc', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=8, leading=11, textColor=colors.HexColor('#64748b'))

    story = []
    story.append(Paragraph("VitalAI — Intelligent Health & Early Warning Report", header_style))
    now_str = datetime.now(timezone.utc).strftime("%B %d, %Y at %H:%M UTC")
    story.append(Paragraph("Generated on " + now_str + " | Confidential Medical Decision Support", sub_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0f766e'), spaceAfter=10))

    # Patient details
    story.append(Paragraph("1. Patient Identification & Clinical Baseline", sec_style))
    p_name = str(patient.get('full_name', 'N/A'))
    p_id = str(patient.get('id', 'N/A'))
    p_dob = str(patient.get('date_of_birth', 'N/A'))
    p_gender = str(patient.get('gender', 'N/A'))
    p_cond = str(patient.get('existing_conditions', 'None'))
    p_meds = str(patient.get('medications', 'None'))

    pat_rows = [
        [Paragraph("<b>Name:</b> " + p_name, body_style), Paragraph("<b>ID:</b> " + p_id, body_style), Paragraph("<b>DOB:</b> " + p_dob, body_style)],
        [Paragraph("<b>Gender:</b> " + p_gender, body_style), Paragraph("<b>Conditions:</b> " + p_cond, body_style), Paragraph("<b>Medications:</b> " + p_meds, body_style)]
    ]
    t_pat = Table(pat_rows, colWidths=[180, 180, 180])
    t_pat.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_pat)
    story.append(Spacer(1, 10))

    # AI Assessment
    story.append(Paragraph("2. AI Health Risk Assessment & Early Warning Summary", sec_style))
    risk_lvl = assessment.get('risk_level', 'Normal')
    risk_sc = assessment.get('risk_score', 0.0)
    rec = str(assessment.get('recommendation', 'Continue standard routine.'))
    
    risk_box = [
        [Paragraph("<b>AI Risk Status:</b> <b>" + str(risk_lvl).upper() + " (" + str(risk_sc) + "% / 100)</b>", body_style),
         Paragraph("<b>Confidence:</b> " + str(round(assessment.get('confidence_score', 0.95)*100, 1)) + "%", body_style)],
        [Paragraph("<b>Clinical Guidance:</b> " + rec, body_style), ""]
    ]
    t_risk = Table(risk_box, colWidths=[270, 270])
    t_risk.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f1f5f9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#0f766e')),
        ('SPAN', (0,1), (1,1)),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_risk)
    story.append(Spacer(1, 10))

    # Factors
    story.append(Paragraph("3. Explainable AI (SHAP) Factor Attribution", sec_style))
    factors = assessment.get('detected_factors', [])
    if factors:
        f_rows = [[Paragraph("• " + str(f), body_style)] for f in factors]
    else:
        f_rows = [[Paragraph("• All vital parameters within expected physiological limits.", body_style)]]
    t_fact = Table(f_rows, colWidths=[540])
    t_fact.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.white),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_fact)
    story.append(Spacer(1, 10))

    # Vitals table
    story.append(Paragraph("4. Recent Vital Signs Temporal Progression", sec_style))
    v_rows = [["Timestamp", "Heart Rate", "Blood Pressure", "SpO₂", "Blood Glucose", "Resp Rate", "Temp"]]
    for v in vitals[-5:]:
        v_time = str(v.get('recorded_at', ''))[:16].replace('T', ' ')
        hr_s = str(v.get('heart_rate', '-')) + " BPM"
        bp_s = str(v.get('systolic_bp', '-')) + "/" + str(v.get('diastolic_bp', '-'))
        sp_s = str(v.get('spo2', '-')) + "%"
        gl_s = str(v.get('blood_glucose', '-')) + " mg/dL"
        rr_s = str(v.get('respiratory_rate', '-')) + " /min"
        tp_s = str(v.get('body_temperature', '-')) + " °C"
        v_rows.append([v_time, hr_s, bp_s, sp_s, gl_s, rr_s, tp_s])
    t_v = Table(v_rows, colWidths=[110, 75, 95, 60, 80, 60, 60])
    t_v.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f766e')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_v)
    story.append(Spacer(1, 12))

    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#94a3b8'), spaceAfter=6))
    story.append(Paragraph(
        "CLINICAL DISCLAIMER: VitalAI provides AI-assisted decision support and early-warning insights. "
        "It does not formulate a medical diagnosis and should never replace evaluation by a qualified physician. "
        "If experiencing acute emergency symptoms, immediately call emergency services.",
        disclaimer_style
    ))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
