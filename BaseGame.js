// games/BaseGame.js
export class BaseGame {
  mount(container) {
    this.container = container;
  }
  unmount() {
    this.container = null;
  }
}