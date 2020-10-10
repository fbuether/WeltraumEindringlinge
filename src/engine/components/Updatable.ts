import {Component} from "../../engine/components/Component";


export abstract class Updatable extends Component {
  public abstract update(delta: number): void;
}
