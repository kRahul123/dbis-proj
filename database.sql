create table user (
		user_id int not null auto_increment primary key,
        first_name   varchar(20),
        last_name  varchar(20),
        user_name varchar(20) unique,
        email varchar(40) unique,
        phone_no  varchar(20),
        p_word varchar(72)

);

/*user_id will start from 1000 with increment of 1*/
alter table user  auto_increment=1000;

create table company(
		c_id int not null auto_increment primary key,
        company_name varchar(100) not null,
        contact_no varchar(15),
        address varchar(200),
        c_domain varchar(30),
				avg_rating float(3,1),
				avg_salary int
);

/* c_id will start from 14000 with increment of 1*/
alter table company auto_increment=14000;

create table review(
			review_id int not null auto_increment primary key,
            overall_rating int not null,
            salary int ,
            review_title varchar(80),
            pros varchar(200),
            cons varchar(200)
);

create table worked_in(
		user_id int not null,
        company_id int not null,
        working_status varchar(20),
        worked_as varchar(30)
);

create table user_review(
		user_id int not null,
        review_id int not null
);

create table company_review(
		company_id int not null,
        review_id int not null
);


/* inserting a new user in database*/
delimiter //
create procedure new_user(first_name varchar(20),last_name varchar(20),
user_name varchar(20),email varchar(40),
phone_no varchar(20),pass varchar(72))
begin
insert into user (first_name,last_name,user_name,email,phone_no,p_word)
values (first_name,last_name,user_name,email,phone_no,pass);
end;
delimiter ;


/*inserting a new company in database*/
delimiter //
create procedure new_company( c_name varchar(40),phone varchar(15),
address varchar(200),domain varchar(30))
begin
insert into company (company_name,contact_no,address,c_domain)
values
(c_name,phone,address,domain);
end;//
delimiter ;

/* inserting a new review*/

delimiter //
create procedure new_review(o_rating int,salary int,review_title varchar(80),pros varchar(200), cons varchar(200))
begin
insert into review (overall_rating,salary,review_title,pros,cons) values
(o_rating,salary,review_title,pros,cons);
end; //
delimiter ;



/* trigger to update avg rating of the company after addition*/

delimiter //
create trigger average_rating
after insert on  company_review for each row
begin
update company set avg_rating=( select avg(overall_rating) from review,company_review where review.review_id=company_review.review_id and company_id=new.company_id)
where c_id=new.company_id;

end//

delimiter ;

/* trigger to update avg rating of company after deletion*/
delimiter //
create trigger average_rating2
after delete on  company_review for each row
begin
update company set avg_rating=( select avg(overall_rating) from review,company_review where review.review_id=company_review.review_id and company_id=old.company_id)
where c_id=old.company_id;

end//

delimiter ;





/* trigger to update avg salary provided by the company afte addition of data in database*/


delimiter //
create trigger average_salary
after insert on  company_review for each row
begin
update company set avg_salary=( select avg(salary) from review,company_review where review.review_id=company_review.review_id and company_id=new.company_id)
where c_id=new.company_id;

end//

delimiter ;

/* trigger to update avg salary after daletion*/

delimiter //
create trigger average_salary2
after delete on  company_review for each row
begin
update company set avg_salary=( select avg(salary) from review,company_review where review.review_id=company_review.review_id and company_id= old.company_id)
where c_id=old.company_id;

end//

delimiter ;

/* Trigger that fires after any updation is done in the value*/

delimiter //
create trigger after_update_trigger
after update on  company_review for each row
begin
update company set avg_rating=( select avg(overall_rating) from review,company_review where review.review_id=company_review.review_id and company_id=new.company_id)
where c_id=new.company_id;

update company set avg_salary=( select avg(salary) from review,company_review where review.review_id=company_review.review_id and company_id=new.company_id)
where c_id=new.company_id;

end//

delimiter ;




/* Procedure to find the total reviews done by a certain user */

delimiter //
create procedure my_rating(u_id int)
begin
select * from review,user_review,company_review,company where
review.review_id=user_review.review_id and
company_review.review_id=review.review_id and
company.c_id=company_review.company_id
and user_id=u_id;
end //
delimiter ;



/* Procedure to find review_id when company_id and user_id is given*/

delimiter //
create procedure find_review_id(c_id int,user_id int)
begin
select company_review.review_id from company_review,user_review where company_review.review_id=user_review.review_id and
user_review.user_id=user_id and
company_review.company_id=c_id;
end //
delimiter ;



/* Trasaction  to delete a user review from database  */

delimiter //
create procedure delete_review(user_i int,c_id int,review_i int)
begin
start transaction;
delete from worked_in where user_id=user_i and company_id=c_id;
delete from company_review where company_id=c_id and review_id=review_i;
delete from user_review where user_id=user_i and review_id=review_i;
delete from review where review_id=review_i;
commit;
end //
delimiter ;
