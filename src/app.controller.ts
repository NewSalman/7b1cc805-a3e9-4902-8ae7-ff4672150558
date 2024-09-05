import { Body, Controller, Get, Post, Query, Redirect, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateAccountDTO } from './model/create-acocount-dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render("home/home.hbs")
  home(
    @Query("column") column, 
    @Query("order") order,
    @Query("page") page,
    @Query("count") count) : Object {
    let key = (column === null || column === undefined) ? "" : column;
    let orderBy = (order === null || order === undefined) ? "" : order;
    let pageCount = Number.isNaN(parseInt(page)) ? 1 : parseInt(page);
    let dataCount = Number.isNaN(parseInt(count)) ? 25 : parseInt(count);
    return { data: this.appService.getData(key, orderBy, pageCount, dataCount) };
  }

  @Post()
  @Redirect("/")
  saveRecord(@Body() createAccountDTO: CreateAccountDTO) {
    this.appService.addRecord(createAccountDTO);
    return "ok";
  }
}
