# 재고 회전율 및 발주 관리 시스템 (SCM)

회사 납품용 엔터프라이즈 MVP — Next.js App Router, Tailwind CSS, SQLite + Prisma, 세션 인증, ABC 분석.

## 빠른 시작 (터미널)

```powershell
cd C:\Users\nhy78\turnover-management-system
npm install
copy .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

- **로그인:** http://localhost:3000/login  
- **대시보드:** http://localhost:3000/dashboard  
- **테스트 계정:** `admin` / `1234qwer`

```powershell
npm test
npm run build
npm run db:studio
```

## 디렉토리 구조 (Clean Architecture)

```
src/
├── domain/
│   ├── constants/scmConstants.ts
│   ├── entities/          # Product, User, SessionPayload
│   └── services/          # turnover, stockAlert, abcAnalysis, productMetricsBuilder
├── application/
│   ├── ports/             # IProductRepository, IUserRepository, ISessionService, IPasswordHasher
│   └── use-cases/         # productUseCases, authUseCases
├── infrastructure/
│   ├── auth/              # JWT 세션, bcrypt
│   ├── db/prisma.ts
│   ├── data/mockProductFactory.ts
│   └── repositories/      # Prisma Product/User, getProductRepository, getAuthServices
├── presentation/components/
│   ├── LoginForm.tsx
│   ├── Dashboard.tsx
│   ├── ProductTable.tsx
│   └── ProductForm.tsx
├── app/
│   ├── login/
│   ├── dashboard/
│   └── api/               # products CRUD, auth login/logout
├── lib/                   # productApi, session
└── middleware.ts          # 라우트 보호
prisma/
├── schema.prisma
└── seed.ts
```

## 물류 계산 요약

| 지표 | 공식 |
|------|------|
| 단순 일일 출하 | (M1+M2+M3) / 3 / 30 |
| 보정 일일 출하 | 단순 × seasonalityIndex |
| 회전율(일) | currentStock / 보정 일일 (0이면 999) |
| 🔴 발주 | 회전율 ≤ 90 + leadTime |
| 🟢 적정 | 90+leadTime < 회전율 ≤ 180 |
| ⚠️ 과다 | 회전율 > 180 |
| 추천 발주 | max(0, 보정일일×(90+리드타임) − 재고) — 🔴 발주 필요 시 항상 표시 |
| ABC | 3개월 출하금액 기준 A 20% / B 30% / C 50% |

## DB

- SQLite 파일: `prisma/dev.db`
- HeidiSQL: 네트워크 유형 **SQLite**, 파일 경로 지정 (IP/포트 없음)

스키마 변경 후 재시드:

```powershell
npx prisma db push --force-reset
npm run db:seed
```
