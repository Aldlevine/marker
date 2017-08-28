export function getElementInLine (fx, fy, tx, ty, sel, step=16)
{
  let dx = tx - fx;
  let dy = ty - fy;
  let magnitude = Math.sqrt(dx*dx + dy*dy);
  let nx = dx / magnitude;
  let ny = dy / magnitude;
  let sx = nx * step;
  let sy = ny * step;

  // try center
  let el = document.elementFromPoint(fx, fy);
  if (el && (!sel || $(el).is(sel)))
  {
    return el;
  }

  // try along line
  for (let i=0, ii=magnitude/step; i<ii; i++)
  {
    el = document.elementFromPoint(fx + sx*i, fy + sy*i);
    if (el && (!sel || $(el).is(sel)))
    {
      return el;
    }
  }
}

