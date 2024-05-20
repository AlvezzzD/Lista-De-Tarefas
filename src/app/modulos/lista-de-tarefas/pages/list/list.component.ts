import { Component, signal } from '@angular/core';
import { InputAddItemComponent } from '../../components/input-add-item/input-add-item.component';
import { IListItens } from '../../interface/IListItens.interface';
import { InputListItemComponent } from '../../components/input-list-item/input-list-item.component';
import { LocalStorage } from '../../enum/LocalStorage.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [InputAddItemComponent, InputListItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  public addItem = signal(true);

  #setListItens = signal<IListItens[]>([this.#parseItems()]);
  public getListItems = this.#setListItens.asReadonly();

  #parseItems(){ 
    return JSON.parse(localStorage.getItem(LocalStorage.MY_LIST) || '[]')
  }

  #updateLocalStorage(){
    return localStorage.setItem(
      LocalStorage.MY_LIST,
      JSON.stringify(this.#setListItens())
    );
  }

  public getInputAndAddItem(value: IListItens){
    localStorage.setItem(LocalStorage.MY_LIST, JSON.stringify([...this.#setListItens(), value]));

    //sempre atualiza os dados
    return this.#setListItens.set(this.#parseItems());
  }

  public ListItemStage(value: 'pending' | 'completed') {
    return this.getListItems().filter((res: IListItens) =>{
      if (value === 'pending'){
        return !res.checked;
      }

      if (value === 'completed') {
        return res.checked;
      }

      return res;
    })
  }

  public updateItemCheckbox(newitem: {id: string; checked: boolean}){
    this.#setListItens.update((oldvalue: IListItens[]) => {
      oldvalue.filter((res)=>{
        if (res.id === newitem.id) {
          res.checked = newitem.checked;
          return res;
        }

        return res;
      });

      return oldvalue;
    });

    return this.#updateLocalStorage()
  }

  public updateItemtext(newitem: {id: string; value: string}){
    this.#setListItens.update((oldvalue: IListItens[]) => {
      oldvalue.filter((res)=>{
        if (res.id === newitem.id) {
          res.value = newitem.value;
          return res;
        }

        return res;
      });

      return oldvalue;
    });

    return this.#updateLocalStorage()
  }

  public deleteItem(id:string){

    Swal.fire({
      title: "Tem certeza que deseja cancelar?",
      text: "Voçe não poderá reverter isso",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, Delete o item!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.#setListItens.update((oldValue: IListItens[]) => {
          return oldValue.filter((res) => res.id !== id);
        });
    
        return this.#updateLocalStorage()
      }
    });
  }

  public deleteAllItems(){

    Swal.fire({
      title: "Tem certeza que deseja cancelar?",
      text: "Voçe não poderá reverter isso",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, Delete tudo!"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(LocalStorage.MY_LIST);
        return this.#setListItens.set(this.#parseItems());
      }
    });
  }

}
