drop table if exists users cascade;
create table users(
    id serial primary key,
    email varchar(30),
    password varchar(30),
    name varchar(30),
    phone varchar(30),
    date_creation date
);

insert into users(email, password, name, phone, date_creation)
values('test@gmail.com', 'test', 'test', '0971234567', current_date);

drop table if exists producers cascade;
create table producers(
    id serial primary key,
    user_id int,
    name varchar(30),
    region_id int,
    date_creation date,
    description text,
    image_link varchar(255)
);

drop table if exists customers cascade;
create table customers(
    id serial primary key,
    user_id int,
    date_creation date
);

drop table if exists regions cascade;
create table regions(
    id serial primary key,
    region_name varchar(30)
);

drop table if exists factory_size cascade;
create table factory_size(
    id serial primary key,
    name varchar(30)
);

drop table if exists manufacturing_steps cascade;
create table manufacturing_steps(
    id serial primary key,
    name varchar(45)
);

drop table if exists sewing_types cascade;
create table sewing_types(
    id serial primary key,
    name varchar(30)
);

drop table if exists orders cascade;
create table orders(
    id serial primary key,
    customer_id int,
    name varchar(100),
    region_id int,
    available bool,
    description text,
    date_creation date,
    image_link varchar(255)
);

drop table if exists producers_sewing_types cascade;
create table producers_sewing_types(
    id serial primary key,
    producer_id int,
    sewing_type_id int
);

drop table if exists orders_sewing_types cascade;
create table orders_sewing_types(
    id serial primary key,
    order_id int,
    sewing_type_id int
);

drop table if exists producers_manufacturing_steps cascade;
create table producers_manufacturing_steps(
    id serial primary key,
    producer_id int,
    manufacturing_step_id int
);

drop table if exists orders_manufacturing_steps cascade;
create table orders_manufacturing_steps(
    id serial primary key,
    order_id int,
    manufacturing_step_id int
);

insert into regions(region_name)
values ('Вся Украина'),
       ('Винницкая'),
       ('Волынская'),
       ('Днепропетровская'),
       ('Донецкая'),
       ('Житомирская'),
       ('Закарпатская'),
       ('Запорожская'),
       ('Ивано-Франковская'),
       ('Киевская'),
       ('Кировоградская'),
       ('Луганская'),
       ('Львовская'),
       ('Николаевская'),
       ('Одесская'),
       ('Полтавская'),
       ('Ровненская'),
       ('Сумская'),
       ('Тернопольская'),
       ('Харьковская'),
       ('Херсонская'),
       ('Хмельницкая'),
       ('Черкасская'),
       ('Черниговская'),
       ('Черновицкая'),
       ('Крым');

insert into sewing_types(name)
values ('Спортивная одежда'),
       ('Верхняя одежда'),
       ('Обувь'),
       ('Нижнее белье'),
       ('Постельное белье'),
       ('Покрывала одеяла подушки'),
       ('Головные уборы'),
       ('Носки перчатки'),
       ('Джинсы'),
       ('Мех'),
       ('Кожа'),
       ('Трикотаж'),
       ('Платья, блузки'),
       ('Рубашки'),
       ('Спец Одежда');

insert into manufacturing_steps(name)
values ('Разроботка лекал'),
       ('Покрой, раскройка'),
       ('Отшив'),
       ('Термическая обработка'),
       ('Нанесение рисунка на ткань (аппликация)'),
       ('Упаковка'),
       ('Пришив фурнитуры (пуговицы)'),
       ('Выбор и поиск материалов (ткань, фурнитура)');
