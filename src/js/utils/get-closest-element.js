export function getClosestElement (x, y, sel, radius=16, points=9)
{
  // try center
  let el = document.elementFromPoint(x, y);
  if (el && (!sel || $(el).is(sel)))
  {
    return el;
  }

  // try circle around
  let angle = (Math.PI * 2) / points;
  let xr;
  let yr;
  for (let i=0; i<points; i++)
  {
    xr = Math.cos(angle * i);
    yr = Math.sin(angle * i);
    el = document.elementFromPoint(x + xr*radius, y + yr*radius);
    if (el && (!sel || $(el).is(sel)))
    {
      return el;
    }
  }
}

