
import {Component} from "../../engine/components/Component";


export abstract class Renderable extends Component {
  public abstract render(): void;
}
