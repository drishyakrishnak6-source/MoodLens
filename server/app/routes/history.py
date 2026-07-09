# YOUR FILE — History routes.
# Matches "5. API Endpoints" in the architecture doc:
#   GET    /history            -> user analysis history
#   GET    /history/search     -> matching analyses
#   DELETE /history/{id}       -> delete one analysis
#   GET    /history/export     -> CSV download

import csv
import io

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_

from ..database import get_db
from ..models import Analysis, User
from ..auth import get_current_user
from ..schemas import HistoryResponse, AnalysisOut

router = APIRouter(prefix="/history", tags=["History"])


@router.get("", response_model=HistoryResponse)
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return all analyses belonging to the logged-in user, newest first."""
    items = (
        db.query(Analysis)
        .filter(Analysis.user_id == current_user.id)
        .order_by(Analysis.created_at.desc())
        .all()
    )
    return {"data": items}


@router.get("/search", response_model=HistoryResponse)
def search_history(
    q: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Search the user's history by text, sentiment, emotions, or entities."""
    keyword = f"%{q}%"
    items = (
        db.query(Analysis)
        .filter(
            Analysis.user_id == current_user.id,
            or_(
                Analysis.text.ilike(keyword),
                Analysis.sentiment.ilike(keyword),
                Analysis.emotions.ilike(keyword),
                Analysis.entities.ilike(keyword),
            ),
        )
        .order_by(Analysis.created_at.desc())
        .all()
    )
    return {"data": items}


@router.get("/export")
def export_history(
    format: str = "csv",  # "csv" or "pdf"
    include_text: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Export the user's history as CSV or PDF, with or without the full entry text."""
    items = (
        db.query(Analysis)
        .filter(Analysis.user_id == current_user.id)
        .order_by(Analysis.created_at.desc())
        .all()
    )

    columns = ["id", "sentiment", "confidence", "emotions", "entities", "created_at"]
    if include_text:
        columns.insert(1, "text")

    if format == "pdf":
        return _export_pdf(items, columns)
    return _export_csv(items, columns)


def _export_csv(items, columns):
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(columns)
    for item in items:
        writer.writerow([getattr(item, col) for col in columns])
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=mood_history.csv"},
    )


def _export_pdf(items, columns):
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import landscape, letter
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.platypus import (
        SimpleDocTemplate,
        Table,
        TableStyle,
        Paragraph,
        Spacer,
    )

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=landscape(letter))
    styles = getSampleStyleSheet()
    cell_style = styles["BodyText"]
    cell_style.fontSize = 8
    cell_style.leading = 10

    header_labels = {
        "id": "ID",
        "text": "Entry",
        "sentiment": "Sentiment",
        "confidence": "Confidence",
        "emotions": "Emotions",
        "entities": "Entities",
        "created_at": "Date",
    }

    table_data = [[header_labels[col] for col in columns]]
    for item in items:
        row = []
        for col in columns:
            value = getattr(item, col)
            if col == "text":
                row.append(Paragraph(str(value or ""), cell_style))
            elif col == "created_at":
                row.append(str(value)[:19])
            else:
                row.append(str(value) if value is not None else "")
        table_data.append(row)

    # Give the "text" column the most room if it's included
    col_widths = None
    if "text" in columns:
        col_widths = []
        for col in columns:
            col_widths.append(260 if col == "text" else 70)

    table = Table(table_data, colWidths=col_widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#7c3aed")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTSIZE", (0, 0), (-1, 0), 9),
                ("FONTSIZE", (0, 1), (-1, -1), 8),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dddddd")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f7f7f9")]),
            ]
        )
    )

    elements = [
        Paragraph("MoodLens — Mood History", styles["Title"]),
        Spacer(1, 12),
        table,
    ]
    doc.build(elements)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=mood_history.pdf"},
    )


@router.get("/{analysis_id}", response_model=AnalysisOut)
def get_history_item(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return a single analysis — used by the detail view page."""
    item = (
        db.query(Analysis)
        .filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return item


@router.delete("/{analysis_id}")
def delete_history_item(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a single analysis — only if it belongs to the logged-in user."""
    item = (
        db.query(Analysis)
        .filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Analysis not found")

    db.delete(item)
    db.commit()
    return {"message": "Analysis deleted successfully"}