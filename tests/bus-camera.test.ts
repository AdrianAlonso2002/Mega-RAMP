import {describe,expect,it} from 'vitest';
import {Vector3} from 'three';
import {Camera} from '../src/rendering/Camera';

describe('Santa Catalina bus camera',()=>{
  it.each([30,60,120])('follows the bus rather than player motion at %i FPS',fps=>{
    const camera=new Camera(),bus=new Vector3(0,.7,0),player=new Vector3(0,2,0);
    camera.setBusView(bus);camera.snapTo(player);
    const initial=camera.object.position.clone().sub(bus);
    for(let frame=0;frame<fps*3;frame++){
      bus.z-=6/fps;player.x+=4/fps;
      camera.setBusView(bus);camera.follow(player,new Vector3(4,0,0),1/fps,[]);
    }
    expect(camera.object.position.clone().sub(bus).distanceTo(initial)).toBeLessThan(.001);
    expect(initial.y).toBeGreaterThan(initial.z);
    const direction=camera.object.getWorldDirection(new Vector3());
    const aim=bus.clone().add(new Vector3(0,1,0)).sub(camera.object.position).normalize();
    expect(direction.dot(aim)).toBeGreaterThan(.999);
    camera.setBusView(null);camera.snapTo(player);
    expect(camera.object.position.y-player.y).toBeLessThan(10);
  });
});
