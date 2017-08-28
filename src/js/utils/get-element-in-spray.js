export function getElementInSpray (fx, fy, tx, ty, sel, step=16, angle=Math.PI/6, points=3)
{
  let dx = tx - fx;
  let dy = ty - fy;
  let magnitude = Math.sqrt(dx*dx + dy*dy);
  let nx = dx / magnitude;
  let ny = dy / magnitude;
  let sx = nx * step;
  let sy = ny * step;
  let sprayAngle = Math.atan2(ny/nx);
  let startAngle = sprayAngle - (angle*points/2);

  // try center
  let el = document.elementFromPoint(fx, fy);
  if (el && (!sel || $(el).is(sel)))
  {
    return el;
  }

  // try along spray
  let xr;
  let yr;
  for (let i=0, ii=magnitude/step; i<ii; i++)
  {
    for (let j=0; j<points; j++)
    {
      xr = Math.cos(startAngle + angle * j);
      yr = Math.sin(startAngle + angle * j);
      el = document.elementFromPoint(fx + xr*step*i/*sx*i*/, fy + yr*step*i/*sy*i*/);
      if (el && (!sel || $(el).is(sel)))
      {
        return el;
      }
    }
  }
}

