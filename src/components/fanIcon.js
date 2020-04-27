import React from 'react';

const FanIcon = ({
  colorCodeInHex = "#0080C7",
  className
}) => {

  return <svg xmlns="http://www.w3.org/2000/svg" className={className} width="248" height="298" viewBox="0 0 248 298">
  <g fill="none" fill-rule="evenodd">
      <path fill="#E2A428" d="M161.5 206.276L157.225 202 143.5 215.724 147.777 220zM142.5 217.059L138.441 213 134.5 216.943 138.557 221zM101.239 193.464L96.909 197.748 110.311 211 114.448 206.905 109.759 202.266 114.448 197.627 109.759 192.988 114.448 188.349 109.759 183.71 114.5 179.02 110.433 175 96.5 188.777zM139.243 183.71L134.552 188.351 139.243 192.988 134.552 197.629 139.243 202.266 134.552 206.907 138.691 211 152.091 197.748 147.763 193.464 152.5 188.777 138.567 175 134.5 179.02zM114.5 216.943L110.559 213 106.5 217.059 110.443 221z"/>
      <path fill="#E2A428" d="M161.091 206.014L165.629 210.558 151.204 225.002 146.903 220.697 133.052 234.566 128.322 229.834 133.1 225.051 128.799 220.745 133.458 216.082 128.799 211.418 133.458 206.755 128.799 202.09 133.458 197.429 128.799 192.763 133.458 188.102 128.799 183.437 133.341 178.888 124.001 170 114.657 178.888 119.201 183.437 114.542 188.102 119.201 192.763 114.542 197.429 119.201 202.09 114.542 206.755 119.201 211.418 114.542 216.082 119.201 220.745 114.9 225.051 119.678 229.834 114.948 234.566 101.095 220.697 96.796 225.002 82.371 210.558 86.909 206.014 78.626 197.718 69.5 206.854 91.996 229.378 96.533 224.835 110.124 238.441 119.201 247.529 114.471 252.264 100.665 238.441 96.941 234.713 93.216 238.441 92.475 239.182 119.201 265.946 114.542 270.608 119.201 275.273 114.542 279.934 119.201 284.6 114.542 289.261 119.201 293.926 114.542 298.587 119.201 303.253 114.542 307.916 119.201 312.579 115.14 316.644 119.201 320.71 114.542 325.374 119.201 330.037 114.542 334.7 119.201 339.363 114.542 344.027 119.201 348.69 114.542 353.353 119.201 358.017 114.782 362.44 119.201 366.865 114.542 371.529 124.001 381 133.458 371.529 128.799 366.865 133.218 362.44 128.799 358.017 133.458 353.353 128.799 348.69 133.458 344.027 128.799 339.363 133.458 334.7 128.799 330.037 133.458 325.374 128.799 320.71 132.86 316.644 128.799 312.579 133.458 307.916 128.799 303.253 133.458 298.587 128.799 293.926 133.458 289.261 128.799 284.6 133.458 279.934 128.799 275.273 133.458 270.608 128.799 265.946 155.525 239.182 154.784 238.441 151.061 234.713 147.335 238.441 133.529 252.264 128.799 247.529 137.876 238.441 151.467 224.835 156.004 229.378 178.5 206.854 169.376 197.718z"/>
      <path fill="#E2A428" d="M105.5 215.724L91.777 202 87.5 206.276 101.225 220z"/>
      <path fill="#000" d="M237.901 129.804l4.567 4.57-8.906 8.913 4.57 4.572-13.37 13.377 4.568 4.574-14.214 14.223 4.655 4.655-27.585 27.602-4.611-4.614.034-.034-4.738-4.74-.032.033-9.14-9.15.031-.03-4.74-4.743-.032.032-4.099-4.102-4.232 4.233 4.101 4.103-8.541 8.545-4.115-4.117 4.139-4.144.017.016 4.228-4.234-18.614-18.627-4.23 4.235 13.86 13.867-4.714 4.718 4.308 4.312-13.331 13.339-4.115-4.12 4.666-4.671-4.666-4.67 4.666-4.669-4.666-4.67 4.666-4.669-4.718-4.72 4.044-4.047-9.139-9.142-4.472 4.02-4.476-4.02-9.139 9.142 4.046 4.046-4.716 4.721 4.662 4.67-4.662 4.67 4.662 4.668-4.662 4.67 4.662 4.671-4.113 4.12-13.333-13.34 4.308-4.311-4.713-4.718 13.86-13.867-4.23-4.235-18.615 18.627 4.23 4.234.017-.016 4.14 4.144-4.116 4.117-8.541-8.545 4.103-4.103-4.232-4.233-4.101 4.102-.034-.032-4.738 4.743.034.03-9.143 9.15-.032-.034-4.738 4.741.032.034-4.61 4.614-27.584-27.602 4.653-4.655-14.214-14.223 4.57-4.574-13.37-13.377 4.568-4.572-8.906-8.912 4.569-4.57-4.8-4.805L.5 129.804l4.57 4.57-4.427 4.432 8.867 8.874-4.546 4.55 13.284 13.29-4.79 4.79 14.12 14.128-4.366 4.374 49.955 49.983 9.976 9.982 4.567-4.572-5.404-5.41-22.262-22.273 4.61-4.614 26.872 26.887.815.814-4.668 4.672 26.705 26.722-4.662 4.671 4.662 4.67-4.662 4.67 4.662 4.669-4.662 4.671 4.662 4.667-4.662 4.672 4.662 4.667-4.662 4.67 4.067 4.072-4.067 4.071 4.662 4.668-4.662 4.67 4.662 4.67-4.662 4.668 4.662 4.672-4.662 4.669 4.662 4.67-4.662 4.669 4.426 4.429-4.426 4.43 4.662 4.67-4.662 4.668L119.979 387l4.022-4.022 4.018 4.022 10.267-10.274-4.666-4.667 4.666-4.672-4.426-4.429 4.426-4.43-4.666-4.669 4.666-4.669-4.666-4.67 4.666-4.67-4.666-4.668 4.666-4.672-4.666-4.67 4.666-4.667-4.069-4.071 4.07-4.072-4.667-4.67 4.666-4.667-4.666-4.672 4.666-4.667-4.666-4.671 4.666-4.67-4.666-4.67 4.666-4.669-4.666-4.671 26.707-26.722-4.666-4.672.811-.814 26.873-26.887 4.61 4.614-22.26 22.273-5.407 5.41 4.571 4.572 9.974-9.982 49.955-49.983-4.369-4.374 14.119-14.128-4.786-4.79 13.284-13.29-4.55-4.55 8.871-8.874-4.428-4.431 4.571-4.57-4.801-4.805-4.798 4.804zM119.67 230.175l-4.79-4.788 4.312-4.31-4.669-4.67 4.669-4.671-4.669-4.668 4.669-4.671-4.669-4.67 4.669-4.669-4.669-4.67 4.669-4.669-4.554-4.554 9.363-8.9 9.359 8.9-4.552 4.554 4.669 4.67-4.669 4.67 4.669 4.668-4.669 4.67 4.669 4.671-4.669 4.668 4.669 4.671-4.669 4.67 4.31 4.31-4.788 4.788 4.74 4.741 13.879-13.889 4.307 4.312 14.456-14.463-4.55-4.552 8.304-8.305 9.143 9.147-22.541 22.555-4.548-4.549-13.617 13.623-9.095 9.101 4.74 4.739 13.831-13.84 3.734-3.734 3.732 3.734.745.743-26.782 26.797 4.669 4.668-4.669 4.671 4.669 4.67-4.669 4.67 4.669 4.669-4.669 4.671 4.669 4.667-4.669 4.672 4.669 4.667-4.669 4.67 4.07 4.072-4.07 4.071 4.669 4.668-4.669 4.67 4.669 4.67-4.669 4.668 4.669 4.672-4.669 4.669 4.669 4.67-4.669 4.669 4.427 4.429-4.427 4.43 4.669 4.67-9.476 9.482-9.478-9.481 4.669-4.672-4.429-4.429 4.429-4.43-4.669-4.669 4.669-4.669-4.669-4.67 4.669-4.67-4.669-4.668 4.669-4.672-4.669-4.67 4.669-4.667-4.07-4.071 4.07-4.072-4.669-4.67 4.669-4.667-4.669-4.672 4.669-4.667-4.669-4.671 4.669-4.67-4.669-4.67 4.669-4.669-4.669-4.671 4.669-4.668-26.78-26.797.74-.743 3.733-3.734 3.734 3.734 13.83 13.84 4.743-4.739-9.097-9.1-13.617-13.624-4.546 4.549-22.54-22.555 9.144-9.147 8.3 8.305-4.548 4.552 14.454 14.463 4.307-4.312 13.88 13.89 4.74-4.742zm23.211-14.367l13.52-13.528 4.212 4.215-13.52 13.527-4.212-4.214zm-55.496-9.313l4.212-4.215 13.522 13.528-4.213 4.214-13.521-13.527zm46.235 9.912l4.115-4.12 4.238 4.24-4.117 4.119-4.236-4.239zm-27.593.12l4.238-4.24 4.113 4.12-4.234 4.239-4.117-4.12zM238.5 120.499L242.999 125 247.5 120.499 242.999 116zM238.5 111.499L242.999 116 247.5 111.499 242.999 107zM233.5 97.609L242.89 107 247.5 102.391 238.11 93zM238.89 93L243.5 88.389 234.108 79 229.5 83.611zM234 79L238.5 74.498 225 61 220.5 65.5zM188.081 24.3L224.937 61 229.5 56.454 192.646 19.752 188.252 24.13 175.065 11 170.5 15.544 183.687 28.676zM170.5 15.445L161.055 6 156.5 10.553 165.945 20zM142.5 5.555L151.945 15 156.5 10.445 147.055 1zM132.5 5.34L137.162 10 141.5 5.66 136.842 1z"/>
      <path fill="#000" d="M1.5 120.499L5.999 125 10.5 120.499 5.999 116zM1.5 111.499L5.999 116 10.5 111.499 5.999 107zM1.5 102.391L6.108 107 15.5 97.609 10.888 93zM14.89 79L5.5 88.389 10.108 93 19.5 83.611zM24 61L10.5 74.498 15 79 28.5 65.5zM65.313 28.676L78.5 15.546 73.937 11 60.748 24.13 60.833 24.215 56.352 19.752 19.5 56.454 24.063 61 60.919 24.3zM92.5 10.555L87.945 6 78.5 15.447 83.055 20zM92.5 10.445L97.053 15 106.5 5.555 101.947 1zM107.5 5.66L111.84 10 116.5 5.34 112.16 1zM127.612 0L124.502 2.964 121.392 0 116.5 4.662 121.056 9 124.502 5.717 127.948 9 132.5 4.662z"/>
      <path fill={colorCodeInHex} d="M87.604 189.11L106.187 170.53 110.41 174.754 119.533 165.635 124 169.645 128.467 165.635 137.59 174.754 141.813 170.53 160.396 189.11 160.565 188.942 164.789 184.72 168.882 188.813 168.915 188.78 173.645 193.511 173.614 193.541 182.739 202.668 182.773 202.635 187.503 207.364 187.469 207.396 192.072 212 219.611 184.466 214.964 179.822 229.154 165.635 224.592 161.072 237.938 147.728 233.379 143.169 242.27 134.279 237.709 129.718 242.5 124.925 237.938 120.365 242.5 115.804 237.938 111.245 242.5 106.684 233.208 97.392 237.77 92.833 228.478 83.543 233.04 78.984 219.357 65.299 223.917 60.741 187.089 23.919 182.697 28.309 169.518 15.134 164.958 19.695 155.496 10.236 150.936 14.795 141.474 5.337 136.914 9.9 132.014 5 127.452 9.561 124 6.109 120.548 9.561 115.986 5 111.086 9.9 106.526 5.337 97.064 14.795 92.504 10.236 83.042 19.695 78.482 15.134 65.303 28.309 60.911 23.919 24.083 60.741 28.643 65.299 14.96 78.984 19.522 83.543 10.23 92.833 14.792 97.392 5.5 106.684 10.062 111.245 5.5 115.804 10.062 120.365 5.5 124.925 10.291 129.718 5.73 134.279 14.621 143.169 10.062 147.728 23.408 161.072 18.846 165.635 33.036 179.822 28.389 184.466 55.928 212 60.531 207.396 60.497 207.364 65.227 202.635 65.261 202.668 74.386 193.541 74.355 193.511 79.085 188.78 79.118 188.813 83.211 184.72 87.435 188.942z"/>
  </g>
</svg>;
}

export default FanIcon;