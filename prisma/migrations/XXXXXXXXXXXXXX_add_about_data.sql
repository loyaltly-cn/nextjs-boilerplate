-- 添加用户数据
INSERT INTO "User" ("id", "name", "email", "password", "isAdmin", "createdAt", "updatedAt")
VALUES 
('admin', 'Admin', 'admin@example.com', 'e10adc3949ba59abbe56e057f20f883e', true, NOW(), NOW()),  -- 密码: 123456
('user1', 'User One', 'user1@example.com', 'e10adc3949ba59abbe56e057f20f883e', false, NOW(), NOW());

-- 添加 AboutItem 数据
INSERT INTO "AboutItem" ("id", "imageUrl", "title", "description", "content", "order", "isActive", "createdAt", "updatedAt")
VALUES 
('t1', 'https://example.com/image1.jpg', 't1', 'd1', 'content1', 0, true, NOW(), NOW()),
('t2', 'https://example.com/image2.jpg', 't2', 'd2', 'content2', 1, true, NOW(), NOW()),
('t3', 'https://example.com/image3.jpg', 't3', 'd3', 'content3', 2, true, NOW(), NOW());

-- 添加 AboutVideo 数据
INSERT INTO "AboutVideo" ("id", "url", "size", "mimeType", "createdAt", "updatedAt")
VALUES 
('v1', 'https://example.com/video1.mp4', 1024000, 'video/mp4', NOW(), NOW()),
('v2', 'https://example.com/video2.mp4', 2048000, 'video/mp4', NOW(), NOW()); 