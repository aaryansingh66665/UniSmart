// Local Storage Mock Database for UniSmart AI Management System

const DEFAULT_FACULTY = [
  { id: "FAC202401", name: "Dr. Elena Rodriguez", email: "e.rodriguez@gmu.edu", department: "Computer Science", courses: "Advanced ML, Neural Networks", role: "Senior Professor", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeDOTNbhrINgTbRQZU25Q9x-ihoHnBFRMA18ceexHV-RJcm6IceAftgH-SQIZhURsVm1fbW-YQCpD2cnN48sfLod7Ht_zP-YoLDHG3PnpkW-WS6k5p5OGlRDNr4PnY1CTEqsCgvN5-iF1DmT2xwOeCVHFY8DeQbZ1SHtE80hEgphMioZhRrS78elYwERHGjR5CjEoVhFll7wl-CW59Mq4EvRsHVjfVy2qYgvCRvpVadSyIiY_hDO-C50zAGz0IKF59qb9q5t7vKCoj", score: 92 },
  { id: "FAC202402", name: "Prof. Alan Turing", email: "a.turing@gmu.edu", department: "Computer Science", courses: "Theory of Computation, Algorithms", role: "Dean of CS", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alan", score: 95 },
  { id: "FAC202403", name: "Dr. Grace Hopper", email: "g.hopper@gmu.edu", department: "Computer Science", courses: "Compiler Design, System Programming", role: "Associate Professor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace", score: 71 },
  { id: "FAC202404", name: "Prof. Ada Lovelace", email: "a.lovelace@gmu.edu", department: "Life Sciences", courses: "Bio-Informatics, Computational Genetics", role: "Professor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ada", score: 88 },
  { id: "FAC202405", name: "Dr. Claude Shannon", email: "c.shannon@gmu.edu", department: "Business Analytics", courses: "Information Theory, Data Architecture", role: "Assistant Professor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Claude", score: 64 }
];

const DEFAULT_STUDENTS = [
  { roll: "CS202401", name: "Felix Anderson", department: "Computer Science", attendance: 98, risk: 10, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAk8fPpkqE7LRU8FaCXWNuxgo8q36mDFEh51E3nRhsfjtszDVU-sBRjoTgvzR4cbYTDITcPPhmnCa2m777xQXIMfhKMziv8RYwaOymbxv-sl6pKm1hIa1fhjB_i3sW2uWrWceTc1SJY7CtaY7DACIeksbg11C0_2LbIVDOAWB8wh7sQqbCYCXNwC2OImbUPqCK8RJyuYgkCuL2X9_wjMQdumQ_GRVzzh-tfFrpDTnKAhesFAzIxb4Wj4-yPavtS19efLMLSwa2L9bw1" },
  { roll: "CS202402", name: "Sarah Mitchell", department: "Computer Science", attendance: 95, risk: 12, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfLLcZb8-HlAWpc0UuMJZY5QOW8pIWOtA7YDO5XlO92LBzkPHWBnnhuNrzpuvLmF-agiBOSBbBdpLPHdLtj3uVV4_-tpbawoaWwm1KdImthyxeiZXm4mt7VxUA296yQqT89GAeBBP3hMYGZcIWBnd5d9tRbqad7cWSXEMdImKvxj9YSZx6ZnD-IJUPwrjcKEfbnGA2sI32vYPOZd8oZc4ENfyXcsBEMa9an2uA8Ui05aHgtpU_OM7Z0bAUHM4djCRMf5Sbfp2rb-_b" },
  { roll: "CS202403", name: "Marcus Thorne", department: "Computer Science", attendance: 62, risk: 82, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCMurKEbc1QyGa4Up4q79jZ-Hqp_QM7_x1M0zdQJjK5-kCONC4GmSnkR1A-0v72S6xJEyig0zllE7ysB4DlqMA3Z91QDfWPd1Kk1R2P9VR8m9fjpta0rp5rbg1b86TrFKJvfD8yGaY2XwhliS2HfymD_F55ktaquH5FAiMFxgPx2v6fzvbSajOeQSxQcgSPMtEOEtj_r-3nNxBLZhxAgllWOGoBdunzX1K-kQ8JaGgmXm1xxKyYRNhROVGAjZJ8Qq8OhZEJKcppu5R" },
  { roll: "BA202401", name: "James Wilson", department: "Business Analytics", attendance: 84, risk: 25, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James" },
  { roll: "FA202401", name: "Aria Gupta", department: "Fine Arts", attendance: 72, risk: 78, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria" },
  { roll: "LS202401", name: "David Chen", department: "Life Sciences", attendance: 91, risk: 14, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
  { roll: "LS202402", name: "Leila Vance", department: "Life Sciences", attendance: 89, risk: 19, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leila" }
];

const DEFAULT_ALERTS = [
  { id: "alt01", title: "Dropout Alert: Engineering Dept.", message: "Predictive analysis indicates a 15% drop in second-year engagement in thermodynamics. Immediate faculty intervention recommended.", time: "2 hours ago", department: "Computer Science", priority: "critical", status: "unread" },
  { id: "alt02", title: "Scholarship Eligibility Update", message: "42 students in the Honors Program have exceeded the threshold for 'Dean's List Plus' incentives.", time: "5 hours ago", department: "All", priority: "normal", status: "unread" },
  { id: "alt03", title: "System Synchronization Complete", message: "LMS records synced with Central Financial Aid database. All records are up to date.", time: "12 hours ago", department: "System", priority: "low", status: "read" }
];

const DEFAULT_SETTINGS = {
  theme: "sky-blue",
  institutionName: "Global Metropolitan University",
  institutionCode: "GMU-AI-2024",
  primaryDomain: "unismart.gmu.edu.int",
  activeLLMProvider: "UniSmart Neural-X (Internal)",
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  smtpUser: "unismart.portal@gmail.com",
  smtpPass: "xxxx xxxx xxxx xxxx",
  tlsEncryption: true,
  otpExpiryTime: 120,
  twoFAEnabled: true,
  riskThreshold: 85
};

const DEFAULT_REPORTS = [
  { id: "REP001", name: "Q4 Attendance Summary Report", date: "2024-06-10", type: "CSV", size: "124 KB", generatedBy: "Alex Thompson" },
  { id: "REP002", name: "AI Dropout Risk Prediction Audit", date: "2024-06-08", type: "XLSX", size: "348 KB", generatedBy: "System (Auto)" }
];

// Initialize DB if empty
function initDb() {
  const needsMigration = !localStorage.getItem("unismart_initialized") || 
                         !localStorage.getItem("unismart_faculty") || 
                         !localStorage.getItem("unismart_faculty").includes('"score"');
                         
  if (needsMigration) {
    localStorage.setItem("unismart_faculty", JSON.stringify(DEFAULT_FACULTY));
    localStorage.setItem("unismart_students", JSON.stringify(DEFAULT_STUDENTS));
    localStorage.setItem("unismart_alerts", JSON.stringify(DEFAULT_ALERTS));
    localStorage.setItem("unismart_settings", JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem("unismart_reports", JSON.stringify(DEFAULT_REPORTS));
    localStorage.setItem("unismart_initialized", "true");
  }
}

initDb();

export const db = {
  getFaculty() {
    return JSON.parse(localStorage.getItem("unismart_faculty"));
  },
  saveFaculty(list) {
    localStorage.setItem("unismart_faculty", JSON.stringify(list));
  },
  addFaculty(faculty) {
    const list = this.getFaculty();
    list.push(faculty);
    this.saveFaculty(list);
  },
  deleteFaculty(id) {
    const list = this.getFaculty().filter(f => f.id !== id);
    this.saveFaculty(list);
  },
  
  getStudents() {
    return JSON.parse(localStorage.getItem("unismart_students"));
  },
  saveStudents(list) {
    localStorage.setItem("unismart_students", JSON.stringify(list));
  },
  updateStudentAttendance(roll, isPresent) {
    const list = this.getStudents();
    const student = list.find(s => s.roll === roll);
    if (student) {
      // Recalculate average attendance
      let newAttendance = student.attendance;
      if (isPresent) {
        newAttendance = Math.min(100, Math.round(student.attendance * 1.02 * 10) / 10);
      } else {
        newAttendance = Math.max(0, Math.round(student.attendance * 0.95 * 10) / 10);
      }
      student.attendance = newAttendance;
      
      // Recalculate AI dropout risk score
      // If attendance falls, dropout risk surges
      if (newAttendance < 75) {
        student.risk = Math.min(99, Math.round((100 - newAttendance) * 1.3));
      } else {
        student.risk = Math.max(5, Math.round((100 - newAttendance) * 0.8));
      }
      this.saveStudents(list);
    }
  },
  
  getAlerts() {
    return JSON.parse(localStorage.getItem("unismart_alerts"));
  },
  saveAlerts(list) {
    localStorage.setItem("unismart_alerts", JSON.stringify(list));
  },
  resolveAlert(id) {
    const list = this.getAlerts().filter(a => a.id !== id);
    this.saveAlerts(list);
  },
  
  getSettings() {
    return JSON.parse(localStorage.getItem("unismart_settings"));
  },
  saveSettings(settings) {
    localStorage.setItem("unismart_settings", JSON.stringify(settings));
    // Dispatch custom event to trigger UI theme updates
    window.dispatchEvent(new Event("unismart_settings_changed"));
  },
  
  getReports() {
    return JSON.parse(localStorage.getItem("unismart_reports"));
  },
  saveReports(list) {
    localStorage.setItem("unismart_reports", JSON.stringify(list));
  },
  addReport(report) {
    const list = this.getReports();
    list.unshift(report);
    this.saveReports(list);
  }
};
export default db;
