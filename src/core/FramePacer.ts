/** Keep fractional deadlines instead of dropping them on 90/120/144 Hz displays. */
export class FramePacer {
  private next=0;
  private limit=0;
  shouldRender(now:number,fps:number):boolean {
    const interval=1000/fps;
    if(this.limit!==fps){this.limit=fps;this.next=now;}
    if(now+.1<this.next)return false;
    const missed=Math.max(1,Math.floor((now-this.next)/interval)+1);
    this.next+=missed*interval;
    return true;
  }
}
