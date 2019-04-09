import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortItemsPipe'
})
export class SortItemsPipe implements PipeTransform {

  transform(items: Array<any>, direction: String, scores: any, counts: any) {
    if (direction === 'score') {
      const order = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
      return items.sort((a, b) => order.indexOf(a.value.id) < order.indexOf(b.value.id) ? -1 : 1);
    }
    if (direction === 'votes') {
      const order = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
      return items.sort((a, b) => order.indexOf(a.value.id) < order.indexOf(b.value.id) ? -1 : 1);
    }
    if (direction === 'name') {
      return items.sort((a, b) => a.value.id < b.value.id ? -1 : 1);
    }
    return items;
  }

}
