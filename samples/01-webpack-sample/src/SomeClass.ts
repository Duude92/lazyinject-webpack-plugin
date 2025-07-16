import { ISomeInterface } from './interface/ISomeInterface';
import {Export, Import} from "@duude92/lazyinject";

@Export(SomeClass)
export class SomeClass {
  constructor(
    @Import('ISomeInterface')
    private readonly someImplementation: ISomeInterface,
  ) {}

  print = () => this.someImplementation.print();
}
