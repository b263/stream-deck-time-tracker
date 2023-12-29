export const Icons = new Map([
  [
    "play",
    ({ workedToday }) => `
    <svg height="144" width="144" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" fill="black"/>
      <path d="M 16.386019,11.25111 10.808539,7.5328229 C 10.210444,7.1340869 9.4093087,7.5628379 9.4093087,8.2816679 V 15.71835 c 0,0.71883 0.8011353,1.14759 1.3992303,0.7488 l 5.57748,-3.71826 c 0.53442,-0.35631 0.53442,-1.14147 0,-1.49778 z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="12" y="4" text-anchor="middle" font-size="4px" fill="white">${workedToday}</text>
    </svg>`,
  ],
  [
    "pause",
    ({ sum, cur }) => {
      let text = `
        <text x="6" y="4" text-anchor="middle" font-size="4px" fill="white">${sum}</text>
        <text x="18" y="4" text-anchor="middle" font-size="4px" fill="white">${cur}</text>
      `;
      if (sum === cur) {
        text = `
          <text x="12" y="4" text-anchor="middle" font-size="4px" fill="white">${sum}</text>
        `;
      }
      return `
        <svg height="144" width="144" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" fill="black"/>
          <path d="m 8.85,17.4 h 0.9 c 0.49707,0 0.9,-0.40293 0.9,-0.9 v -9 c 0,-0.497052 -0.40293,-0.9 -0.9,-0.9 h -0.9 c -0.497052,0 -0.9,0.402948 -0.9,0.9 v 9 c 0,0.49707 0.402948,0.9 0.9,0.9 z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="m 14.25,17.4 h 0.9 c 0.49707,0 0.9,-0.40293 0.9,-0.9 v -9 c 0,-0.497052 -0.40293,-0.9 -0.9,-0.9 h -0.9 c -0.49707,0 -0.9,0.402948 -0.9,0.9 v 9 c 0,0.49707 0.40293,0.9 0.9,0.9 z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
          ${text}
        </svg>
      `;
    },
  ],
]);
