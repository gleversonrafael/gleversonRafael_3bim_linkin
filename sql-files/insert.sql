-- ============================================
-- ACCOUNT (20 rows)
-- ============================================
INSERT INTO ACCOUNT (unique_username, account_name, account_email) VALUES
('carlos.mendes',    'Carlos Mendes',      'carlos.mendes@gmail.com'),
('patricia.lopes',   'Patrícia Lopes',     'patricia.lopes@outlook.com'),
('ricardo_dias',     'Ricardo Dias',       'ricardo.dias@yahoo.com'),
('sofia.moreira',    'Sofia Moreira',      'sofia.moreira@gmail.com'),
('andre.cardoso',    'André Cardoso',      'andre.cardoso@hotmail.com'),
('mariana.teixeira', 'Mariana Teixeira',   'mariana.teixeira@gmail.com'),
('gustavo.pinto',    'Gustavo Pinto',      'gustavo.pinto@protonmail.com'),
('leticia.campos',   'Letícia Campos',     'leticia.campos@gmail.com'),
('rodrigo_farias',   'Rodrigo Farias',     'rodrigo.farias@outlook.com'),
('bianca.freitas',   'Bianca Freitas',     'bianca.freitas@gmail.com'),
('eduardo.nunes',    'Eduardo Nunes',      'eduardo.nunes@yahoo.com'),
('carolina.ramos',   'Carolina Ramos',     'carolina.ramos@gmail.com'),
('matheus.duarte',   'Matheus Duarte',     'matheus.duarte@hotmail.com'),
('renata.azevedo',   'Renata Azevedo',     'renata.azevedo@gmail.com'),
('henrique.lins',    'Henrique Lins',      'henrique.lins@outlook.com'),
('paula.vieira',     'Paula Vieira',       'paula.vieira@gmail.com'),
('samuel.batista',   'Samuel Batista',     'samuel.batista@yahoo.com'),
('debora.cunha',     'Débora Cunha',       'debora.cunha@gmail.com'),
('leonardo.melo',    'Leonardo Melo',      'leonardo.melo@hotmail.com'),
('viviane.castro',   'Viviane Castro',     'viviane.castro@gmail.com');


-- ============================================
-- APP_ADMIN (20 rows)
-- ============================================
INSERT INTO APP_ADMIN (admin_id, admin_canManageUsers, admin_canManagePosts) VALUES
('carlos.mendes',    TRUE,  TRUE),
('patricia.lopes',   TRUE,  FALSE),
('ricardo_dias',     FALSE, TRUE),
('sofia.moreira',    TRUE,  TRUE),
('andre.cardoso',    FALSE, FALSE),
('mariana.teixeira', FALSE, TRUE),
('gustavo.pinto',    TRUE,  FALSE),
('leticia.campos',   FALSE, TRUE),
('rodrigo_farias',   TRUE,  TRUE),
('bianca.freitas',   FALSE, FALSE),
('eduardo.nunes',    TRUE,  FALSE),
('carolina.ramos',   FALSE, TRUE),
('matheus.duarte',   FALSE, FALSE),
('renata.azevedo',   TRUE,  TRUE),
('henrique.lins',    TRUE,  FALSE),
('paula.vieira',     FALSE, TRUE),
('samuel.batista',   FALSE, FALSE),
('debora.cunha',     TRUE,  TRUE),
('leonardo.melo',    TRUE,  FALSE),
('viviane.castro',   FALSE, TRUE);


-- ============================================
-- POST (20 rows)
-- post_id is set explicitly; img_id (SERIAL) is auto-generated
-- ============================================
INSERT INTO POST (post_id, creator_id, caption) VALUES
(1,  'carlos.mendes',    'Morning hike with the best view in town ⛰️'),
(2,  'patricia.lopes',   'Brunch with the girls 🥞🍓'),
(3,  'ricardo_dias',     'Throwback to last summer''s road trip 🚗☀️'),
(4,  'sofia.moreira',    'New tattoo, who''s surprised? 🖤'),
(5,  'andre.cardoso',    'Cooking pasta from scratch for the first time 🍝'),
(6,  'mariana.teixeira', 'Yoga at sunrise, best way to start the day 🧘‍♀️'),
(7,  'gustavo.pinto',    'Built my own mechanical keyboard ⌨️ #diy'),
(8,  'leticia.campos',   'Beach day with no plans 🏖️'),
(9,  'rodrigo_farias',   'Match day at the stadium 🏟️⚽'),
(10, 'bianca.freitas',   'Rainy days and a good playlist 🌧️🎧'),
(11, 'carlos.mendes',    'Camping under the stars tonight ⭐🏕️'),
(12, 'eduardo.nunes',    'Fresh haircut, fresh start 💈'),
(13, 'carolina.ramos',   'Painted this mural downtown 🎨 #streetart'),
(14, 'matheus.duarte',   'Sunday football with the boys ⚽🔥'),
(15, 'renata.azevedo',   'Homemade bread is therapy 🍞'),
(16, 'sofia.moreira',    'Concert last night was unreal 🎤🎶'),
(17, 'paula.vieira',     'Weekend getaway to the mountains 🏔️'),
(18, 'samuel.batista',   'Learning to play the piano, day 30 🎹'),
(19, 'debora.cunha',     'My little garden is growing 🌿🌸'),
(20, 'viviane.castro',   'Coffee shop find of the month ☕📚');