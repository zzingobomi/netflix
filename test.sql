update movie 
set "likeCount" = 10
where id < 20

update movie 
set "likeCount" = 20
where id > 20 and id < 40

# Page 기반 페이지네이션
select id, title, "likeCount" 
from movie
order by "likeCount" desc, id desc
limit 5
offset 5

# Cursor 기반 페이지네이션
select id, title, "likeCount", "createdAt"  
from movie
where ("likeCount" < 20)
	or ("likeCount" = 20 and id < 35)
	or ("likeCount" = 20 and id = 35 and "createdAt" < '2024-10-23 23:13:17.326')
order by "likeCount" desc, id desc, "createdAt" desc
limit 5

# Postgres, MySQL 축약된 표현
select id, title, "likeCount", "createdAt"  
from movie
where ("likeCount", id, "createdAt") < (20, 35, '2024-10-23 23:13:17.326')
order by "likeCount" desc, id desc, "createdAt" desc
limit 5

# movie_user_like 테스트 데이터 생성
insert into movie_user_like ("userId", "movieId", "isLike")
	values
	(1, 2, true),
	(1, 3, true),
	(1, 5, false),
	(2, 5, false),
	(2, 6, true),
	(2, 7, true)