import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from "node:fs";
import { join } from 'node:path';
import { Account } from './model/account';
import { AccountDTO } from './model/account-dto';
import { AccountPaginationDTO } from './model/account-pagination-dto';
import { CreateAccountDTO } from './model/create-acocount-dto';

@Injectable()
export class AppService {
  // data : Array<Account>;
  
  getData(column: string, order: string, page: number, count: number): AccountPaginationDTO {
    const buffer = fs.readFileSync(join(__dirname, "..", "raw-data", "raw-data.json"));
    const data = JSON.parse(buffer.toString()) as Array<Account>;

    let dataResult = new Array();
    let paginationDataResult = new Array();
    const currentPage = page;
    const renderPage = currentPage - 1;
    const calculateOverflowCount = count > data.length ? data.length : count;
    const pageCount = Math.ceil(data.length / count);
    let links = "";

    if(column === "" || order === "") {
      links = this._createLinks(pageCount, renderPage, calculateOverflowCount);
      dataResult = data;
    } else {
      links = this._createLinks(pageCount, renderPage, calculateOverflowCount, column, order);
      dataResult = this._filterBy(column, order, data);
    }

    if(page <= 1) {
      page = 1;
      paginationDataResult = dataResult.slice(0, calculateOverflowCount);
    } else {
      paginationDataResult = dataResult.slice(calculateOverflowCount * renderPage , (calculateOverflowCount * renderPage) + calculateOverflowCount);
    }

    return {
      page: page,
      pageCount: pageCount,
      dataPerPage: paginationDataResult.length,
      result: paginationDataResult,
      links: links,
    };
   
  }

  _filterBy(column: string, order: string, data: Array<Account>) : Array<Account> {
    // const keys = ["id", "name", "posts", "followers", "email", "phone"];
    const orderBy = ["asc", "desc"];

    const keyColumn = column.toLowerCase().trim();
    const keyOrderBy = order.toLowerCase().trim();

    if(!orderBy.includes(keyOrderBy)) {
      return data;
    }

    switch(keyColumn) {
      case "id":
        return data.sort((a, b) => {
          if(keyOrderBy === "asc") {
            return a.id - b.id;
          }

          return b.id - a.id;
        })

      case "name":
        return data.sort((a, b) => {
          const aName : string = a.name;
          const bName : string = b.name;

          if(keyOrderBy === "asc") {
            return aName.toString().localeCompare(bName.toString());
          }

          return bName.toString().localeCompare(a.name.toString());
        });

        case "posts": 
          return data.sort((a, b) => {
            if(keyOrderBy === "asc") {
              return a.posts - b.posts;
            }
            
            return b.posts - a.posts;
          });

        case "followers": 
          return data.sort((a, b) => {
            if(keyOrderBy === "asc") {
              return a.followers - b.followers;
            }
  
            return b.followers - a.followers;
          });

        case "email":
          return data.sort((a, b) => {
            const aEmail : string = a.email;
            const bEmail : string = b.email;

            if(keyOrderBy === "asc") {
              return aEmail.toString().localeCompare(bEmail.toString());
            }

            return bEmail.toString().localeCompare(aEmail.toString());
          });

          case "phone": 
          return data.sort((a, b) => {
            // const numA = a.phone.trim().substring(5, a.phone.length).replaceAll("-", "").split("");
            // const numB = b.phone.trim().substring(5, b.phone.length).replaceAll("-", "").split("");
            const numA = a.phone.trim().substring(5, a.phone.length).replaceAll("-", "");
            const numB = b.phone.trim().substring(5, b.phone.length).replaceAll("-", "");

            if(keyOrderBy === "asc") {
              return numA.toString().localeCompare(numB.toString());
            } 

            return numB.toString().localeCompare(numA.toString())
          });

      default:
        return data;

    }
  }


  _createLinks(pageCount: number, currentPage: number, count: number, column?: string, orderBy?: string) : string {
    let result = `<div class='flex flex-row justify-center'>`;

    const filterQuery = column == null ? "" : `&column=${column}&order=${orderBy}`;

    for(let i = 0; i < pageCount; i++) {
      result += `
          <a 
          class="py-2 px-3 border ${i === currentPage ? "text-blue-500" : ""} border-slate-300" 
          href="http://localhost:3000?page=${i+1}${filterQuery}&count=${count}">
          ${i+1}
          </a>
        ` 
      
    }

    result.concat(`/<div>`);

    return result;
  }

  addRecord(createAccountDTO: CreateAccountDTO) {
    const buffer = fs.readFileSync(join(__dirname, "..", "raw-data", "raw-data.json"));
    const data = JSON.parse(buffer.toString()) as Array<Account>;

    data.map((account) => { 
      return {
        email: account.email,
        phone: account.phone,
        name: account.name,
      }
    });

    const regex = /^[0-9-]+$/;
    const regexDigitsOnly = /^[0-9]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(
      !regex.test(createAccountDTO.phone) || 
      !regexDigitsOnly.test(createAccountDTO.followers.toString()) ||
      !regexDigitsOnly.test(createAccountDTO.posts.toString()) ||
      !emailRegex.test(createAccountDTO.email)
    ) {
      
      throw new BadRequestException("data invalid");
    }

    const exists = data.filter((acc) => acc.email === createAccountDTO.email && acc.phone === acc.phone && acc.name === createAccountDTO.name)

    if(exists.length > 0) {

      console.log(exists);
      throw new BadRequestException("data already exists");
    }

    const newAccount : Account = {
      id: data.length +=1,
      name: createAccountDTO.name,
      channel_info: "",
      category: "",
      posts: createAccountDTO.posts,
      followers: createAccountDTO.followers,
      avg_likes: 0,
      eng_rate: "0%",
      email: createAccountDTO.email,
      phone: "(+62)" + createAccountDTO.phone,
      display_posts: this._toSortDisplay(createAccountDTO.posts),
      display_avg_likes: "0",
      display_followers: this._toSortDisplay(createAccountDTO.followers),
    }
    

    data.push(newAccount);
    fs.writeFileSync(
      join(__dirname, "..", "raw-data", "raw-data.json"), 
      JSON.stringify(data.filter((acc) => acc !== null))
    );    
  }

  _toSortDisplay(valueToShort: number) : string {

    if (valueToShort < 1000) {
      return valueToShort.toString();
    } else if (valueToShort >= 1000 && valueToShort < 1_000_000) {
      return (valueToShort / 1000).toFixed(1) + "K";
    } else if (valueToShort >= 1_000_000 && valueToShort < 1_000_000_000) {
      return (valueToShort / 1_000_000).toFixed(1) + "M";
    } else if (valueToShort >= 1_000_000_000 && valueToShort < 1_000_000_000_000) {
      return (valueToShort / 1_000_000_000).toFixed(1) + "B";
    } else if (valueToShort >= 1_000_000_000_000 && valueToShort < 1_000_000_000_000_000) {
      return (valueToShort / 1_000_000_000_000).toFixed(1) + "T";
    }
  }
}
