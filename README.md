# Wedding Workspace

이 폴더에는 프론트엔드와 백엔드 프로젝트가 들어 있습니다.

## Front

- React 18
- Redux Toolkit
- Vite

개발 서버 실행:

```bash
cd front
npm install
npm run dev
```

프론트의 `/api` 요청은 `http://localhost:8080` Spring Boot 서버로 프록시됩니다.

프로덕션 빌드 확인:

```bash
cd front
npm install
npm run build
npm run preview
```

## Backend

- Spring Boot 3
- Java 17

실행:

```bash
cd backend
mvn spring-boot:run
```

기본 API:

- `GET /api/hello`
