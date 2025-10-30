from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import random, datetime

# Blogger 블로그 ID 입력
BLOG_ID = "509600008452885090"  # 예: '1234567890123456789'

# token.json 불러오기
creds = Credentials.from_authorized_user_file("token.json", ["https://www.googleapis.com/auth/blogger"])
service = build("blogger", "v3", credentials=creds)

# 랜덤 포스팅 시간 설정 (9시 ±10분)
now = datetime.datetime.now()
minute_offset = random.randint(-10, 10)
post_time = (now.replace(hour=9, minute=0) + datetime.timedelta(minutes=minute_offset)).isoformat() + "Z"

# 자동 생성될 예시 포스트
title = "🍎 오늘의 건강정보 - 자동 포스팅 테스트"
content = """
<h2>오늘의 건강 꿀팁</h2>
<p>건강한 식습관은 하루를 바꿉니다.</p>
<p><strong>오늘의 추천 음식:</strong> 아보카도 🥑</p>
"""

# Blogger API를 통해 새 글 게시
post = service.posts().insert(blogId=BLOG_ID, body={
    "kind": "blogger#post",
    "title": title,
    "content": content,
    "published": post_time
}).execute()

print(f"✅ 포스팅 완료! URL: {post['url']}")
