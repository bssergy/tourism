-- ==========================================
--               CREATE TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS region (
	RegionId INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(80) NOT NULL
);

CREATE TABLE IF NOT EXISTS type_of_tourism (
	TypeOfTourismId INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(80) NOT NULL
);

CREATE TABLE IF NOT EXISTS group_of_resourse (
	GroupOfResourseId INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(80) NOT NULL
);

CREATE TABLE IF NOT EXISTS type_of_resourse (
	TypeOfResourseId INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    GroupOfResourseId INT UNSIGNED,
    Name VARCHAR(80) NOT NULL,
    CONSTRAINT FOREIGN KEY FK_Type_Group (GroupOfResourseId) REFERENCES group_of_resourse(GroupOfResourseId)
);

CREATE TABLE IF NOT EXISTS resourse (
	ResourseId INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    RegionId INT UNSIGNED,
    Name VARCHAR(80) NOT NULL,
    CreatedOn DATETIME NOT NULL DEFAULT NOW(),
    TSLastChanged TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    MainImagePath VARCHAR(255) NULL,
    Description VARCHAR(255) NULL,
    Content TEXT NULL,
    CONSTRAINT FOREIGN KEY FK_Resourse_Region (RegionId) REFERENCES region(RegionId)
);

CREATE TABLE IF NOT EXISTS resourse_group_of_resourse (
	ResourseId INT UNSIGNED,
    GroupOfResourseId INT UNSIGNED,
    CONSTRAINT FOREIGN KEY FK_Resourse_Group_Resourse (ResourseId) REFERENCES resourse(ResourseId),
    CONSTRAINT FOREIGN KEY FK_Resourse_Group_Group (GroupOfResourseId) REFERENCES group_of_resourse(GroupOfResourseId)
);

CREATE TABLE IF NOT EXISTS resourse_type_of_resourse (
	ResourseId INT UNSIGNED,
    TypeOfResourseId INT UNSIGNED,
    CONSTRAINT FOREIGN KEY FK_Resourse_Type_Resourse (ResourseId) REFERENCES resourse(ResourseId),
    CONSTRAINT FOREIGN KEY FK_Resourse_Type_Type (TypeOfResourseId) REFERENCES type_of_resourse(TypeOfResourseId)
);

-- ==========================================
--                 FILL DATA
-- ==========================================

-- ------------------------------------------
--                FILL REGION
-- ------------------------------------------

INSERT INTO region (Name) VALUES ('Вінницька область');
INSERT INTO region (Name) VALUES ('Волинська область');
INSERT INTO region (Name) VALUES ('Дніпропетровська область');
INSERT INTO region (Name) VALUES ('Донецька область');
INSERT INTO region (Name) VALUES ('Житомирська область');
INSERT INTO region (Name) VALUES ('Закарпатська область');
INSERT INTO region (Name) VALUES ('Запорізька область');
INSERT INTO region (Name) VALUES ('Івано-Франківська область');
INSERT INTO region (Name) VALUES ('Київська область');
INSERT INTO region (Name) VALUES ('Кіровоградська область');
INSERT INTO region (Name) VALUES ('Луганська область');
INSERT INTO region (Name) VALUES ('Львівська область');
INSERT INTO region (Name) VALUES ('Миколаївська область');
INSERT INTO region (Name) VALUES ('Одеська область');
INSERT INTO region (Name) VALUES ('Полтавська область');
INSERT INTO region (Name) VALUES ('Рівненська область');
INSERT INTO region (Name) VALUES ('Сумська область');
INSERT INTO region (Name) VALUES ('Тернопільська область');
INSERT INTO region (Name) VALUES ('Харківська область');
INSERT INTO region (Name) VALUES ('Херсонська область');
INSERT INTO region (Name) VALUES ('Хмельницька область');
INSERT INTO region (Name) VALUES ('Черкаська область');
INSERT INTO region (Name) VALUES ('Чернівецька область');
INSERT INTO region (Name) VALUES ('Чернігівська область');
INSERT INTO region (Name) VALUES ('Київ');

-- ------------------------------------------
--            FILL TYPE_OF_TOURISM
-- ------------------------------------------

INSERT INTO type_of_tourism (Name) VALUES ('Культурно-пізнавальний');
INSERT INTO type_of_tourism (Name) VALUES ('Сільський');
INSERT INTO type_of_tourism (Name) VALUES ('Агротуризм');
INSERT INTO type_of_tourism (Name) VALUES ('Екологічний');
INSERT INTO type_of_tourism (Name) VALUES ('Ностальгійний');
INSERT INTO type_of_tourism (Name) VALUES ('Екстремальний');
INSERT INTO type_of_tourism (Name) VALUES ('Спелеотуризм');
INSERT INTO type_of_tourism (Name) VALUES ('Гастрономічний');
INSERT INTO type_of_tourism (Name) VALUES ('Лікувально-оздоровчий');
INSERT INTO type_of_tourism (Name) VALUES ('Масовий');
INSERT INTO type_of_tourism (Name) VALUES ('Індустріальний');
INSERT INTO type_of_tourism (Name) VALUES ('Фестивальний');

-- ------------------------------------------
--           FILL GROUP_OF_RESOURSE
-- ------------------------------------------

INSERT INTO group_of_resourse (Name) VALUES ('Історико-культурні');
INSERT INTO group_of_resourse (Name) VALUES ('Природно-кліматичні');
INSERT INTO group_of_resourse (Name) VALUES ('Соціально-економічні');
INSERT INTO group_of_resourse (Name) VALUES ('Подієві');

-- ------------------------------------------
--           FILL TYPE_OF_RESOURSE
-- ------------------------------------------

INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (1, 'Археологічні');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (1, 'Історичні місця');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (1, 'Архітектурні пам\'ятки');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (1, 'Містобудівні пам\'ятки');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (1, 'Релігійно-паломницькі ресурси');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (1, 'Етно-культурні ресурси');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (1, 'Замки і оборонні споруди');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (1, 'Палаци і парки України');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (1, 'Музеї');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (1, 'Скансени');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (2, 'Гірські хребти і вершини');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (2, 'Озера');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (2, 'Річки');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (2, 'Водоспади');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (2, 'Фіторесурси, ліси');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (2, 'Бальнеологічні');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (2, 'Кліматичні');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (2, 'Пляжні');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (2, 'Спелеоресурси');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (3, 'Туристична інфраструктура');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (3, 'Розважальні центри');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (4, 'Спортивні події');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (4, 'Фестивалі');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (4, 'Гастрономічні події');
INSERT INTO type_of_resourse (GroupOfResourseId, Name) VALUES (4, 'Карнавали');