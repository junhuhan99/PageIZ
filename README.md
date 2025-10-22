# PageIZ

누구나 5분 만에 나만의 단일 페이지를 만들고 배포하는 초간단 페이지 빌더입니다.

## Features (MVP)

- 블랙/화이트 테마
- 다양한 블록 타입 (텍스트, 링크, 버튼, 이미지, 영상, 갤러리 등)
- 드래그 앤 드롭 에디터
- SEO 최적화 (메타 태그, OG 이미지, 사이트맵)
- 도메인 관리 (서브도메인, 커스텀 도메인)
- 자동 SSL 발급
- S3 미디어 스토리지
- 분석 기능

## Tech Stack

- **Frontend**: Next.js 16, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma
- **Storage**: AWS S3
- **Auth**: JWT
- **Deployment**: Docker + Nginx + EC2

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL
- AWS Account (for S3)

### Installation

1. Clone the repository

```bash
git clone https://github.com/junhuhan99/PageIZ.git
cd pageiz
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations

```bash
npx prisma migrate dev
```

5. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Using Docker

```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment to EC2

1. SSH into your EC2 instance
2. Clone the repository
3. Setup environment variables
4. Run `docker-compose up -d --build`
5. Run database migrations: `docker-compose exec app npx prisma migrate deploy`
6. Configure Nginx
7. Setup SSL with Certbot

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/sites` - Get user sites
- `POST /api/sites` - Create new site
- `GET /api/pages` - Get site pages
- `POST /api/pages` - Create new page
- `POST /api/blocks` - Create block
- `PUT /api/blocks` - Update block
- `DELETE /api/blocks` - Delete block
- `POST /api/media/upload` - Upload media to S3

## License

MIT
