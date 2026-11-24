import {describe,expect,it} from 'vitest';
import {Vector3,Quaternion,Euler} from 'three';
import {crossesGoalOpening} from '../src/game/GoalCrossing';

describe('continuous portal detection',()=>{
  it.each([30,60,120])('detects a fast crossing between frames at %i FPS',fps=>{
    const before=new Vector3(.3,1,100/fps/2),after=new Vector3(.3,1,-100/fps/2);
    expect(crossesGoalOpening(before,after)).toBe(true);
    expect(crossesGoalOpening(after,before)).toBe(true);
  });
  it('rejects crossings outside the posts, above the frame, and diagonally around a post',()=>{
    expect(crossesGoalOpening(new Vector3(2,1,5),new Vector3(2,1,-5))).toBe(false);
    expect(crossesGoalOpening(new Vector3(0,4,5),new Vector3(0,4,-5))).toBe(false);
    expect(crossesGoalOpening(new Vector3(0,1,5),new Vector3(6,1,-1))).toBe(false);
    expect(crossesGoalOpening(new Vector3(0,1,5),new Vector3(0,1,2))).toBe(false);
  });
  it('works with the local coordinates of a tilted, rotated and moving portal',()=>{
    const rotation=new Quaternion().setFromEuler(new Euler(.4,1.2,.2)),inverse=rotation.clone().invert();
    const oldOrigin=new Vector3(30,7,-12),newOrigin=oldOrigin.clone().add(new Vector3(2,0,0));
    const before=new Vector3(0,1,4).applyQuaternion(rotation).add(oldOrigin);
    const after=new Vector3(0,1,-4).applyQuaternion(rotation).add(newOrigin);
    expect(crossesGoalOpening(before.sub(oldOrigin).applyQuaternion(inverse),after.sub(newOrigin).applyQuaternion(inverse))).toBe(true);
  });
});
