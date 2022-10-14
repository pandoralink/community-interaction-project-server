const token = new URL(
  "/?id=1019&token=Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJfaWQiOjEwMTksInVzZXJfbmFtZSI6Iuaip-ahkOagkeS4i-aIj-WHpOWHsCIsInVzZXJfYWNjb3VudCI6IjEwMTgyODIxIiwidXNlcl9wYXNzd29yZCI6IiIsInVzZXJfaGVhZCI6Imh0dHA6Ly8xMTYuNjMuMTUyLjIwMjo1MDAyL3VzZXJIZWFkL2RlZmF1bHRfaGVhZC5wbmcifSwiaWF0IjoxNjY1NzY1NzQ5LCJleHAiOjE2NjU3OTQ1NDl9.UwBIamX3AMw8VddbzPT-3VCTOiqFvS9xPY9Who7UT54",
  "ws://10.34.198.197:8181"
).searchParams;
console.log(token[0]);
