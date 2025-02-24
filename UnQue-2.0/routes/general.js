import { authMiddleware } from "../middleware/auth.js";
import express from "express"
import { getAvailableSlots, bookAppointment, getStudentAppointments, postponeAppointment } from "../controllers/general.js";
const router = express.Router();
router.get("/professor/:professorId/availability",authMiddleware,getAvailableSlots);
router.post('/book', authMiddleware, bookAppointment);
router.get('/appointments', authMiddleware, getStudentAppointments);
router.patch("/appointments/:appointmentId/postpone", authMiddleware, postponeAppointment);
export default router;
