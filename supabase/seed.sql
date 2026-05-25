-- Seed data: PSG vs Arsenal
-- Chạy file này trong Neon SQL Editor sau khi đã chạy schema.sql

INSERT INTO match_config (home_team, away_team, match_date, is_active)
VALUES ('PSG', 'Arsenal', NOW() + INTERVAL '7 days', true);

-- 5 câu hỏi phụ
INSERT INTO bonus_questions (match_id, question_text, question_type, option_a_label, option_b_label, option_a_points, option_b_points, sort_order)
SELECT id, 'Có bàn thắng trong hiệp 1?', 'yes_no', 'Có', 'Không', 3, 3, 1 FROM match_config WHERE is_active = true;

INSERT INTO bonus_questions (match_id, question_text, question_type, option_a_label, option_b_label, option_a_points, option_b_points, sort_order)
SELECT id, 'Tổng bàn thắng trên 2.5?', 'yes_no', 'Trên 2.5', 'Dưới 2.5', 3, 3, 2 FROM match_config WHERE is_active = true;

INSERT INTO bonus_questions (match_id, question_text, question_type, option_a_label, option_b_label, option_a_points, option_b_points, sort_order)
SELECT id, 'Có thẻ đỏ trong trận?', 'yes_no', 'Có', 'Không', 3, 3, 3 FROM match_config WHERE is_active = true;

INSERT INTO bonus_questions (match_id, question_text, question_type, option_a_label, option_b_label, option_a_points, option_b_points, sort_order)
SELECT id, 'Đội nào giao bóng trước?', 'multiple_choice', 'PSG', 'Arsenal', 2, 2, 4 FROM match_config WHERE is_active = true;

INSERT INTO bonus_questions (match_id, question_text, question_type, option_a_label, option_b_label, option_a_points, option_b_points, sort_order)
SELECT id, 'Cầu thủ xuất sắc nhất trận?', 'motm', NULL, NULL, 5, 0, 5 FROM match_config WHERE is_active = true;

-- Cầu thủ PSG
INSERT INTO players (match_id, name, team) SELECT id, 'Ndjantou', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Jangeal', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Dembélé', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'D. Doué', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Mbaye', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Kvaratskhelia', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Gonçalo Ramos', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Barcola', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Kang-in Lee', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Zaïre-Emery', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Vitinha', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'João Neves', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Fabián Ruiz', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Dro Fernández', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Nsoki', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Mayulu', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Boly', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Marquinhos', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'L. Hernández', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Hakimi', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Lucas Beraldo', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Zabarnyi', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Pacho', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Nuno Mendes', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Safonov', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Marin', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'James', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Chevalier', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Laurendon', 'home' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Vignaud', 'home' FROM match_config WHERE is_active = true;

-- Cầu thủ Arsenal
INSERT INTO players (match_id, name, team) SELECT id, 'Jesus', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Saka', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Gyökeres', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Martinelli', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Annous', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Zečević-John', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Ferdinand', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Frohock', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Madueke', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Zubimendi', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Rice', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Eze', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Havertz', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Trossard', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Ødegaard', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Nørgaard', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Dowman', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Merino', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Bailey-Joseph', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Ibrahim', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Lewis-Skelly', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Julienne', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Marciniak', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Sampang', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Hashi', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Dudziak', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Murisa', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Hincapié', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Chapman', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Ogunnaike', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Ismail', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Onyekachukwu', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Stachow', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Owusu-Gyasi', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Salmon', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Tahou', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'King', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Nichols', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'White', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Calafiori', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'J. Timber', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Saliba', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Gabriel', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Mosquera', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Arrizabalaga', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Raya', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Setford', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Porter', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Ranson', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Rojas', 'away' FROM match_config WHERE is_active = true;
INSERT INTO players (match_id, name, team) SELECT id, 'Talbot', 'away' FROM match_config WHERE is_active = true;
