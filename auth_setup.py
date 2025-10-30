from google_auth_oauthlib.flow import InstalledAppFlow

# Blogger API 권한 범위
SCOPES = ["https://www.googleapis.com/auth/blogger"]

# JSON 파일 경로를 수정하세요 (예: client_secret.json)
flow = InstalledAppFlow.from_client_secrets_file(
    "client_secret.json", SCOPES
)

# 로컬서버에서 구글 로그인 창이 뜹니다
creds = flow.run_local_server(port=0)

# 로그인 후 생성된 토큰 저장
with open("token.json", "w") as token:
    token.write(creds.to_json())

print("✅ token.json 생성 완료! 이제 GitHub Secrets에 추가하세요.")
