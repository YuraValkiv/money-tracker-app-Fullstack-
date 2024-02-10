import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { Observable } from "rxjs";
import { TransactionService } from "../transaction/transaction.service";
import { CategoryService } from "../category/category.service";

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { type, id } = request.params;

    console.log('Type:', type);
    console.log('ID:', id);

    let entity;

    switch (type) {
      case 'transaction':
        console.log("here1")
        entity = await this.transactionService.findOne(id)
        console.log("here1end")
        break
      case 'category':
        console.log("here2")
        entity = await this.categoryService.findOne(id)
        console.log("here2end")
        break
      default:
        console.log("here3")
        throw new NotFoundException('Something went wrong...')
        console.log("here3end")
    }
    console.log("here4")
    const user = request.user
    console.log("here4end")

    console.log("here5")
    if(entity && user && entity.user.id === user.id) {
      return true;
    }
    console.log("here5end")

    throw new BadRequestException('Something went wrong...')
  }

}