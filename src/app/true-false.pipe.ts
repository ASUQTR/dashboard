import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'trueFalse',
    pure: true,
})
export class TrueFalsePipe implements PipeTransform {
    transform(value: boolean): string {
        return value ? 'True' : 'False';
    }
}
