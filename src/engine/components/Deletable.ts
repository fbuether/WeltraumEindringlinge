
import {Component} from "../../engine/components/Component";


export abstract class Deletable extends Component {
  public abstract onDelete(): void;
}
