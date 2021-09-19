class History {
  LENGTH = 100;
  _history = [];
  _curIdx = -1;

  add(s) {
    if (this.getCurrent() === s) return; // ignore duplicates
    this._curIdx++;
    if (this._history.length === this.LENGTH) {
      this._history.shift();
      this._curIdx = this.LENGTH - 1;
    }
    this._history.push(s);
  }
  getCurrent() {
    return this._history[this._curIdx];
  }
  getNext() {
    if (this._history.length === 0) return null;
    this._curIdx++;
    if (this._curIdx === this.LENGTH) this._curIdx = 0;
    return this.getCurrent();
  }
  getPrev() {
    if (this._history.length === 0) return null;
    this._curIdx--;
    if (this._curIdx === -1) this._curIdx = this._history.length - 1;
    return this.getCurrent();
  }
}

export default History;
