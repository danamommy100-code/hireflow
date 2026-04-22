import { useState } from "react";

const JOBS_INIT = [
  { id: 1, title: "프론트엔드 개발자", dept: "개발", type: "정규직", loc: "서울", deadline: "2026-05-15", desc: "React/TypeScript 기반 서비스 개발", requirements: ["React 3년 이상", "TypeScript 필수", "팀 협업 경험"], benefits: ["자율 출퇴근", "점심 제공", "주 1회 재택"], questions: ["포트폴리오 링크를 공유해주세요.", "희망 연봉을 입력해주세요."], open: true },
  { id: 2, title: "백엔드 개발자", dept: "개발", type: "정규직", loc: "서울", deadline: "2026-05-20", desc: "Node.js/Python 서버 개발 및 API 설계", requirements: ["Node.js 또는 Python 3년 이상", "DB 설계 경험", "AWS 경험 우대"], benefits: ["자율 출퇴근", "점심 제공", "스톡옵션"], questions: ["주요 프로젝트 경험을 서술해주세요.", "희망 연봉을 입력해주세요."], open: true },
  { id: 3, title: "프로덕트 디자이너", dept: "디자인", type: "정규직", loc: "서울", deadline: "2026-05-10", desc: "사용자 중심의 UI/UX 설계 및 디자인 시스템 구축", requirements: ["Figma 능숙자", "UX 리서치 경험", "포트폴리오 필수"], benefits: ["자율 출퇴근", "장비 지원", "디자인툴 구독 지원"], questions: ["피그마 포트폴리오 링크를 공유해주세요."], open: true },
  { id: 4, title: "마케팅 매니저", dept: "마케팅", type: "정규직", loc: "서울", deadline: "2026-04-30", desc: "퍼포먼스 마케팅 및 브랜드 전략 수립", requirements: ["퍼포먼스 마케팅 2년 이상", "데이터 분석 능력", "광고 플랫폼 운영 경험"], benefits: ["성과 인센티브", "점심 제공", "교육비 지원"], questions: ["진행했던 캠페인 사례를 공유해주세요.", "희망 연봉을 입력해주세요."], open: false },
];

const INIT_APPLICANTS = [
  { id: 1, jobId: 1, name: "김지현", email: "jihyun@email.com", phone: "010-1234-5678", stage: 1, score: 4, memo: "React 경력 5년, 포트폴리오 우수", appliedAt: "2026-04-10", answers: ["github.com/jihyun", "6000만원"], comments: [{ author: "박팀장", text: "포트폴리오 인상적입니다!", time: "04-11 10:20" }], starred: true },
  { id: 2, jobId: 1, name: "이민준", email: "minjun@email.com", phone: "010-9876-5432", stage: 0, score: 3, memo: "신입이지만 사이드 프로젝트 다수", appliedAt: "2026-04-12", answers: ["github.com/minjun", "4500만원"], comments: [], starred: false },
  { id: 3, jobId: 2, name: "박서연", email: "seoyeon@email.com", phone: "010-5555-4444", stage: 2, score: 5, memo: "AWS 자격증 보유, 스타트업 경험 풍부", appliedAt: "2026-04-08", answers: ["핀테크 스타트업 3년, MSA 전환 경험"], comments: [{ author: "최CTO", text: "기술 스택 완벽합니다", time: "04-09 14:00" }], starred: true },
  { id: 4, jobId: 3, name: "최도현", email: "dohyun@email.com", phone: "010-7777-8888", stage: 3, score: 4, memo: "브랜드 디자인 강점, Figma 능숙", appliedAt: "2026-04-05", answers: ["figma.com/portfolio/dohyun"], comments: [], starred: false },
  { id: 5, jobId: 2, name: "정수빈", email: "subin@email.com", phone: "010-2222-3333", stage: 0, score: 2, memo: "", appliedAt: "2026-04-15", answers: ["Python Django 2년 경험"], comments: [], starred: false },
];

const STAGES = ["서류심사", "1차면접", "2차면접", "처우협의", "최종합격"];
const STAGE_COLORS = ["bg-gray-100 text-gray-700", "bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-yellow-100 text-yellow-700", "bg-green-100 text-green-700"];
const DEPTS = ["전체", "개발", "디자인", "마케팅"];
const DEPT_OPTS = ["개발", "디자인", "마케팅", "기획", "운영"];
const ADMIN_PW = "apple100";

const BLANK_JOB = { title: "", dept: "개발", type: "정규직", loc: "서울", deadline: "", desc: "", requirements: [""], benefits: [""], questions: [""], open: true };

export default function App() {
  const [view, setView] = useState("jobs");
  const [activeJob, setActiveJob] = useState(null);
  const [jobs, setJobs] = useState(JOBS_INIT);
  const [applicants, setApplicants] = useState(INIT_APPLICANTS);
  const [deptFilter, setDeptFilter] = useState("전체");
  const [adminTab, setAdminTab] = useState("kanban");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", answers: [] });
  const [submitted, setSubmitted] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [newMemo, setNewMemo] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [jobFilter, setJobFilter] = useState("all");

  // 관리자 로그인
  const [adminAuth, setAdminAuth] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  // 공고 편집
  const [editingJob, setEditingJob] = useState(null); // null | job object
  const [isNewJob, setIsNewJob] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // job id

  const filteredJobs = jobs.filter(j => deptFilter === "전체" || j.dept === deptFilter);

  const getApplicantsByStage = (stage, jId) =>
    applicants.filter(a => a.stage === stage && (jId === "all" || a.jobId === parseInt(jId)));

  const moveStage = (appId, newStage) => {
    setApplicants(p => p.map(a => a.id === appId ? { ...a, stage: newStage } : a));
    setSelectedApplicant(p => p ? { ...p, stage: newStage } : p);
  };

  const addComment = (appId) => {
    if (!newComment.trim()) return;
    const c = { author: "HR 담당자", text: newComment, time: new Date().toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) };
    setApplicants(p => p.map(a => a.id === appId ? { ...a, comments: [...a.comments, c] } : a));
    setSelectedApplicant(p => ({ ...p, comments: [...(p.comments || []), c] }));
    setNewComment("");
  };

  const updateMemo = (appId) => {
    setApplicants(p => p.map(a => a.id === appId ? { ...a, memo: newMemo } : a));
    setSelectedApplicant(p => ({ ...p, memo: newMemo }));
  };

  const toggleStar = (appId) => {
    setApplicants(p => p.map(a => a.id === appId ? { ...a, starred: !a.starred } : a));
    setSelectedApplicant(p => ({ ...p, starred: !p.starred }));
  };

  const submitApp = () => {
    if (!form.name || !form.email || !form.phone) return;
    setApplicants(p => [...p, { id: Date.now(), jobId: activeJob.id, name: form.name, email: form.email, phone: form.phone, stage: 0, score: 0, memo: "", appliedAt: new Date().toISOString().slice(0, 10), answers: form.answers, comments: [], starred: false }]);
    setSubmitted(true);
  };

  const callAI = async (app) => {
    setAiLoading(true); setAiSummary("");
    try {
      const job = jobs.find(j => j.id === app.jobId);
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: `다음 채용 지원자를 3줄 이내 한국어로 간결하게 평가해주세요:\n이름: ${app.name}\n포지션: ${job?.title}\n메모: ${app.memo || "없음"}\n답변: ${app.answers?.join(", ") || "없음"}\n전형 단계: ${STAGES[app.stage]}` }] })
      });
      const data = await res.json();
      setAiSummary(data.content?.[0]?.text || "분석 실패");
    } catch { setAiSummary("AI 분석 중 오류가 발생했습니다."); }
    setAiLoading(false);
  };

  // 공고 저장
  const saveJob = () => {
    if (!editingJob.title || !editingJob.deadline) return;
    if (isNewJob) {
      setJobs(p => [...p, { ...editingJob, id: Date.now() }]);
    } else {
      setJobs(p => p.map(j => j.id === editingJob.id ? editingJob : j));
    }
    setEditingJob(null); setIsNewJob(false);
  };

  const deleteJob = (id) => {
    setJobs(p => p.filter(j => j.id !== id));
    setApplicants(p => p.filter(a => a.jobId !== id));
    setDeleteConfirm(null);
  };

  // ── 공통 NavBar ──
  const NavBar = () => (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView("jobs"); setSubmitted(false); }}>
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">H</div>
        <span className="font-bold text-gray-800 text-lg">알레르망채용</span>
      </div>
      <div className="flex gap-2">
        <button onClick={() => { setView("jobs"); setSubmitted(false); }} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${view !== "admin" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}>채용공고</button>
        <button onClick={() => { if (adminAuth) { setView("admin"); setAdminTab("kanban"); } else setView("adminLogin"); }} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${view === "admin" || view === "adminLogin" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>관리자</button>
      </div>
    </nav>
  );

  // ── 관리자 로그인 ──
  if (view === "adminLogin") return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-sm shadow-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">🔐</div>
            <h2 className="text-xl font-bold text-gray-900">관리자 로그인</h2>
            <p className="text-sm text-gray-400 mt-1">채용 관리 시스템에 접근합니다</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                type="password"
                value={pwInput}
                onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    if (pwInput === ADMIN_PW) { setAdminAuth(true); setView("admin"); setAdminTab("kanban"); setPwInput(""); setPwError(false); }
                    else setPwError(true);
                  }
                }}
                placeholder="비밀번호를 입력하세요"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none ${pwError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-indigo-400"}`}
              />
              {pwError && <p className="text-xs text-red-500 mt-1">비밀번호가 올바르지 않습니다.</p>}
            </div>
            <button
              onClick={() => {
                if (pwInput === ADMIN_PW) { setAdminAuth(true); setView("admin"); setAdminTab("kanban"); setPwInput(""); setPwError(false); }
                else setPwError(true);
              }}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
            >로그인</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── 채용 공고 리스트 ──
  if (view === "jobs") return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">함께 성장할 인재를 찾습니다 🚀</h1>
          <p className="text-gray-500 mt-2">알레르망과 함께 커리어의 새 챕터를 시작하세요.</p>
        </div>
        <div className="flex gap-2 mb-6 flex-wrap">
          {DEPTS.map(d => <button key={d} onClick={() => setDeptFilter(d)} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${deptFilter === d ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}>{d}</button>)}
        </div>
        <div className="space-y-3">
          {filteredJobs.length === 0 && <p className="text-center text-gray-400 py-12">등록된 공고가 없습니다.</p>}
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-sm transition cursor-pointer" onClick={() => { setActiveJob(job); setView("detail"); }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{job.dept}</span>
                    {!job.open && <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">마감</span>}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{job.loc} · {job.type} · 마감 {job.deadline}</p>
                </div>
                <span className="text-gray-400 text-lg">›</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── 공고 상세 ──
  if (view === "detail") return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => setView("jobs")} className="text-sm text-gray-500 mb-4 flex items-center gap-1 hover:text-gray-800">‹ 목록으로</button>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{activeJob?.dept}</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{activeJob?.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{activeJob?.loc} · {activeJob?.type} · 마감 {activeJob?.deadline}</p>
          <hr className="my-4" />
          <div className="space-y-5">
            <div><h3 className="font-bold text-gray-800 mb-2">📋 업무 내용</h3><p className="text-gray-600 text-sm leading-relaxed">{activeJob?.desc}</p></div>
            <div><h3 className="font-bold text-gray-800 mb-2">✅ 자격 요건</h3><ul className="space-y-1">{activeJob?.requirements.filter(Boolean).map((r, i) => <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-indigo-400">•</span>{r}</li>)}</ul></div>
            <div><h3 className="font-bold text-gray-800 mb-2">🎁 복리후생</h3><div className="flex gap-2 flex-wrap">{activeJob?.benefits.filter(Boolean).map((b, i) => <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">{b}</span>)}</div></div>
          </div>
          <button onClick={() => { setForm({ name: "", email: "", phone: "", answers: activeJob?.questions.map(() => "") }); setView("apply"); setSubmitted(false); }} disabled={!activeJob?.open} className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${activeJob?.open ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed"}`}>{activeJob?.open ? "지원하기" : "마감된 공고입니다"}</button>
        </div>
      </div>
    </div>
  );

  // ── 지원서 ──
  if (view === "apply") return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-xl mx-auto px-4 py-8">
        <button onClick={() => setView("detail")} className="text-sm text-gray-500 mb-4 flex items-center gap-1 hover:text-gray-800">‹ 공고로 돌아가기</button>
        {submitted ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🎉</div>
            <h2 className="text-xl font-bold text-gray-900">지원이 완료되었습니다!</h2>
            <p className="text-gray-500 text-sm mt-2">이메일({form.email})로 접수 확인 메일을 보내드렸습니다.<br />전형 결과는 이메일로 안내드립니다.</p>
            <button onClick={() => { setView("jobs"); setSubmitted(false); }} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">채용공고 더 보기</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">지원서 작성</h2>
            <p className="text-sm text-gray-500 mb-5">{activeJob?.title}</p>
            <div className="space-y-4">
              {[["name", "이름 *", "홍길동"], ["email", "이메일 *", "email@example.com"], ["phone", "연락처 *", "010-0000-0000"]].map(([field, label, ph]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} placeholder={ph} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
                </div>
              ))}
              {activeJob?.questions.filter(Boolean).map((q, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{q}</label>
                  <textarea value={form.answers[i] || ""} onChange={e => { const ans = [...form.answers]; ans[i] = e.target.value; setForm(p => ({ ...p, answers: ans })); }} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none" />
                </div>
              ))}
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">📎 파일 업로드(이력서/포트폴리오)는 실제 환경에서 지원됩니다.</div>
              <label className="flex items-start gap-2 text-xs text-gray-500 cursor-pointer"><input type="checkbox" className="mt-0.5" /><span>개인정보 수집·이용에 동의합니다. (채용 목적으로만 활용되며, 채용 종료 후 즉시 파기됩니다.)</span></label>
              <button onClick={submitApp} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">지원서 제출</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── 관리자 대시보드 ──
  if (view === "admin") {
    const filteredApplicants = jobFilter === "all" ? applicants : applicants.filter(a => a.jobId === parseInt(jobFilter));

    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />

        {/* 공고 편집 모달 */}
        {editingJob && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="font-bold text-gray-900">{isNewJob ? "새 공고 등록" : "공고 수정"}</h3>
                <button onClick={() => { setEditingJob(null); setIsNewJob(false); }} className="text-gray-400 hover:text-gray-700 text-xl">×</button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">공고 제목 *</label>
                  <input value={editingJob.title} onChange={e => setEditingJob(p => ({ ...p, title: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" placeholder="예: 시니어 프론트엔드 개발자" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">부서</label>
                    <select value={editingJob.dept} onChange={e => setEditingJob(p => ({ ...p, dept: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400">
                      {DEPT_OPTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">고용 형태</label>
                    <select value={editingJob.type} onChange={e => setEditingJob(p => ({ ...p, type: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400">
                      {["정규직", "계약직", "인턴"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">근무지</label>
                    <input value={editingJob.loc} onChange={e => setEditingJob(p => ({ ...p, loc: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">마감일 *</label>
                    <input type="date" value={editingJob.deadline} onChange={e => setEditingJob(p => ({ ...p, deadline: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">업무 내용</label>
                  <textarea value={editingJob.desc} onChange={e => setEditingJob(p => ({ ...p, desc: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none" />
                </div>
                {/* 자격 요건 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">자격 요건</label>
                  {editingJob.requirements.map((r, i) => (
                    <div key={i} className="flex gap-2 mb-1">
                      <input value={r} onChange={e => { const arr = [...editingJob.requirements]; arr[i] = e.target.value; setEditingJob(p => ({ ...p, requirements: arr })); }} className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400" placeholder={`요건 ${i + 1}`} />
                      <button onClick={() => setEditingJob(p => ({ ...p, requirements: p.requirements.filter((_, j) => j !== i) }))} className="text-gray-300 hover:text-red-400 text-lg px-1">×</button>
                    </div>
                  ))}
                  <button onClick={() => setEditingJob(p => ({ ...p, requirements: [...p.requirements, ""] }))} className="text-xs text-indigo-600 hover:underline mt-1">+ 추가</button>
                </div>
                {/* 복리후생 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">복리후생</label>
                  {editingJob.benefits.map((b, i) => (
                    <div key={i} className="flex gap-2 mb-1">
                      <input value={b} onChange={e => { const arr = [...editingJob.benefits]; arr[i] = e.target.value; setEditingJob(p => ({ ...p, benefits: arr })); }} className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400" placeholder={`복리후생 ${i + 1}`} />
                      <button onClick={() => setEditingJob(p => ({ ...p, benefits: p.benefits.filter((_, j) => j !== i) }))} className="text-gray-300 hover:text-red-400 text-lg px-1">×</button>
                    </div>
                  ))}
                  <button onClick={() => setEditingJob(p => ({ ...p, benefits: [...p.benefits, ""] }))} className="text-xs text-indigo-600 hover:underline mt-1">+ 추가</button>
                </div>
                {/* 커스텀 질문 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">추가 질문</label>
                  {editingJob.questions.map((q, i) => (
                    <div key={i} className="flex gap-2 mb-1">
                      <input value={q} onChange={e => { const arr = [...editingJob.questions]; arr[i] = e.target.value; setEditingJob(p => ({ ...p, questions: arr })); }} className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400" placeholder={`질문 ${i + 1}`} />
                      <button onClick={() => setEditingJob(p => ({ ...p, questions: p.questions.filter((_, j) => j !== i) }))} className="text-gray-300 hover:text-red-400 text-lg px-1">×</button>
                    </div>
                  ))}
                  <button onClick={() => setEditingJob(p => ({ ...p, questions: [...p.questions, ""] }))} className="text-xs text-indigo-600 hover:underline mt-1">+ 추가</button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-gray-500">공고 상태</label>
                  <button onClick={() => setEditingJob(p => ({ ...p, open: !p.open }))} className={`px-3 py-1 rounded-full text-xs font-medium transition ${editingJob.open ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{editingJob.open ? "진행중" : "마감"}</button>
                </div>
                <div className="flex gap-3 pt-2">
                  {!isNewJob && (
                    <button onClick={() => setDeleteConfirm(editingJob.id)} className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition text-sm">🗑 공고 삭제</button>
                  )}
                  <button onClick={saveJob} disabled={!editingJob.title || !editingJob.deadline} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-40 text-sm">저장</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 삭제 확인 모달 */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <h3 className="font-bold text-gray-900 mb-2">공고를 삭제할까요?</h3>
                <p className="text-sm text-gray-500 mb-5">해당 공고와 관련된 지원자 데이터도 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">취소</button>
                  <button onClick={() => { deleteJob(deleteConfirm); setEditingJob(null); setIsNewJob(false); }} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700">삭제</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex">
          {/* Sidebar */}
          <div className="w-52 bg-white border-r border-gray-200 min-h-screen p-4 flex-shrink-0">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3">채용 관리</p>
            {[["kanban", "📊 칸반 보드"], ["applicants", "👥 지원자 목록"], ["jobs", "📝 공고 관리"]].map(([tab, label]) => (
              <button key={tab} onClick={() => { setAdminTab(tab); setSelectedApplicant(null); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition ${adminTab === tab ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}>{label}</button>
            ))}
            <hr className="my-4" />
            <div className="bg-indigo-50 rounded-lg p-3 mb-3">
              <p className="text-xs font-bold text-indigo-700 mb-1">📈 현황</p>
              <p className="text-xs text-indigo-600">총 지원자 {applicants.length}명</p>
              <p className="text-xs text-indigo-600">진행 공고 {jobs.filter(j => j.open).length}개</p>
            </div>
            <button onClick={() => { setAdminAuth(false); setView("jobs"); }} className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-400 hover:bg-gray-100 transition">🔓 로그아웃</button>
          </div>

          {/* Main */}
          <div className="flex-1 p-6 overflow-auto">

            {/* 칸반 보드 */}
            {adminTab === "kanban" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">칸반 보드</h2>
                  <select value={jobFilter} onChange={e => setJobFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                    <option value="all">전체 공고</option>
                    {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4">
                  {STAGES.map((stage, si) => (
                    <div key={si} className="flex-shrink-0 w-48 bg-gray-100 rounded-xl p-3"
                      onDragOver={e => { e.preventDefault(); setDragOver(si); }}
                      onDrop={() => { if (dragging !== null) { moveStage(dragging, si); setDragging(null); setDragOver(null); } }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STAGE_COLORS[si]}`}>{stage}</span>
                        <span className="text-xs text-gray-400">{getApplicantsByStage(si, jobFilter).length}</span>
                      </div>
                      <div className={`space-y-2 min-h-20 rounded-lg transition ${dragOver === si ? "bg-indigo-50" : ""}`}>
                        {getApplicantsByStage(si, jobFilter).map(app => {
                          const job = jobs.find(j => j.id === app.jobId);
                          return (
                            <div key={app.id} draggable onDragStart={() => setDragging(app.id)} onDragEnd={() => { setDragging(null); setDragOver(null); }}
                              onClick={() => { setSelectedApplicant(app); setNewMemo(app.memo); setAiSummary(""); }}
                              className="bg-white rounded-lg p-3 cursor-grab shadow-sm hover:shadow border border-gray-200 hover:border-indigo-300 transition select-none">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm text-gray-900">{app.name}</span>
                                {app.starred && <span className="text-yellow-400 text-xs">★</span>}
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5 truncate">{job?.title}</p>
                              {app.score > 0 && <div className="text-xs text-yellow-400 mt-1">{"★".repeat(app.score)}</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 지원자 상세 패널 */}
                {selectedApplicant && (
                  <div className="fixed inset-0 bg-black/30 z-50 flex justify-end" onClick={() => setSelectedApplicant(null)}>
                    <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                      <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700">{selectedApplicant.name[0]}</div>
                          <div>
                            <p className="font-bold text-gray-900">{selectedApplicant.name}</p>
                            <p className="text-xs text-gray-400">{selectedApplicant.email}</p>
                          </div>
                          <button onClick={() => toggleStar(selectedApplicant.id)} className={`ml-1 text-xl ${selectedApplicant.starred ? "text-yellow-400" : "text-gray-300"}`}>★</button>
                        </div>
                        <button onClick={() => setSelectedApplicant(null)} className="text-gray-400 hover:text-gray-700 text-xl">×</button>
                      </div>
                      <div className="p-5 space-y-5">
                        <div>
                          <p className="text-xs font-semibold text-gray-400 mb-2">전형 단계 변경</p>
                          <div className="flex flex-wrap gap-2">
                            {STAGES.map((s, si) => (
                              <button key={si} onClick={() => moveStage(selectedApplicant.id, si)} className={`px-2 py-1 rounded-full text-xs font-medium border transition ${selectedApplicant.stage === si ? STAGE_COLORS[si] + " border-current" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>{s}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 mb-1">지원 정보</p>
                          <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                            <p><span className="text-gray-400">연락처:</span> {selectedApplicant.phone}</p>
                            <p><span className="text-gray-400">지원일:</span> {selectedApplicant.appliedAt}</p>
                            <p><span className="text-gray-400">포지션:</span> {jobs.find(j => j.id === selectedApplicant.jobId)?.title}</p>
                          </div>
                        </div>
                        {selectedApplicant.answers?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-400 mb-1">추가 답변</p>
                            {selectedApplicant.answers.map((ans, i) => <div key={i} className="bg-gray-50 rounded-lg p-2 text-sm text-gray-700 mb-1">{ans}</div>)}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-semibold text-gray-400 mb-1">내부 메모</p>
                          <textarea value={newMemo} onChange={e => setNewMemo(e.target.value)} rows={3} placeholder="메모를 입력하세요..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-indigo-400" />
                          <button onClick={() => updateMemo(selectedApplicant.id)} className="mt-1 text-xs text-indigo-600 hover:underline">저장</button>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-gray-400">AI 지원자 분석</p>
                            <button onClick={() => callAI(selectedApplicant)} disabled={aiLoading} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full hover:bg-indigo-700 disabled:opacity-50 transition">{aiLoading ? "분석 중..." : "✨ AI 분석"}</button>
                          </div>
                          {aiSummary && <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-900 leading-relaxed">{aiSummary}</div>}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 mb-2">팀 의견 ({selectedApplicant.comments?.length})</p>
                          <div className="space-y-2 mb-2">
                            {selectedApplicant.comments?.map((c, i) => (
                              <div key={i} className="bg-gray-50 rounded-lg p-2">
                                <div className="flex items-center justify-between mb-0.5"><span className="text-xs font-bold text-gray-700">{c.author}</span><span className="text-xs text-gray-400">{c.time}</span></div>
                                <p className="text-sm text-gray-700">{c.text}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment(selectedApplicant.id)} placeholder="의견을 남겨주세요..." className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
                            <button onClick={() => addComment(selectedApplicant.id)} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm">전송</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 지원자 목록 */}
            {adminTab === "applicants" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">지원자 목록</h2>
                  <select value={jobFilter} onChange={e => setJobFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                    <option value="all">전체 공고</option>
                    {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                  </select>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>{["이름", "포지션", "전형 단계", "지원일", "평점", ""].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {filteredApplicants.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-gray-400">지원자가 없습니다.</td></tr>}
                      {filteredApplicants.map(app => (
                        <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition" onClick={() => { setSelectedApplicant(app); setNewMemo(app.memo); setAiSummary(""); setAdminTab("kanban"); }}>
                          <td className="px-4 py-3 font-medium text-gray-900"><span className="flex items-center gap-1">{app.starred && <span className="text-yellow-400">★</span>}{app.name}</span></td>
                          <td className="px-4 py-3 text-gray-500">{jobs.find(j => j.id === app.jobId)?.title || "-"}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${STAGE_COLORS[app.stage]}`}>{STAGES[app.stage]}</span></td>
                          <td className="px-4 py-3 text-gray-400">{app.appliedAt}</td>
                          <td className="px-4 py-3 text-yellow-400">{"★".repeat(app.score)}</td>
                          <td className="px-4 py-3 text-indigo-500 text-xs">상세 →</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 공고 관리 */}
            {adminTab === "jobs" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">공고 관리</h2>
                  <button onClick={() => { setEditingJob({ ...BLANK_JOB, id: null }); setIsNewJob(true); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">+ 새 공고 등록</button>
                </div>
                <div className="space-y-3">
                  {jobs.length === 0 && <p className="text-center text-gray-400 py-12">등록된 공고가 없습니다.</p>}
                  {jobs.map(job => (
                    <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:border-indigo-200 transition">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${job.open ? "bg-green-400" : "bg-gray-300"}`}></span>
                          <span className="font-medium text-gray-900">{job.title}</span>
                          <span className="text-xs text-gray-400">{job.dept}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">마감 {job.deadline} · 지원자 {applicants.filter(a => a.jobId === job.id).length}명</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${job.open ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{job.open ? "진행중" : "마감"}</span>
                        <button onClick={() => { setEditingJob({ ...job }); setIsNewJob(false); }} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition">수정 / 삭제</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}