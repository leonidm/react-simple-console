class History {
  MAX_LEN = 100;
  _history = [];
  _curIdx = -1;

  add(s) {
    if (!s) return;
    if (this._history[this._history.length - 1] === s) return; // ignore duplicates
    if (this._history.length === this.MAX_LEN) {
      this._history.shift();
    }
    this._history.push(s);
    this._curIdx = this._history.length - 1;
  }
  getCurrent() {
    return this._history[this._curIdx];
  }
  getNext() {
    if (this._history.length === 0) return null;
    if (this._curIdx < this._history.length - 1) this._curIdx++;
    return this.getCurrent();
  }
  getPrev() {
    if (this._history.length === 0) return null;
    if (this._curIdx > 0) this._curIdx--;
    return this.getCurrent();
  }
}

export default History;
