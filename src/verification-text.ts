const getEmailString = (token: string) => `
<h3>Hey there!</h3>

Here is your verification code for Open-Source @ Illinois: 

<br>
<strong>ABCDFEF</strong>
<br>

<h4> Next Steps </h4>

On the OSAI discord, run <code>/verify ${token}</code> to verify your account.

Welcome to Open-Source @ Illinois.
<hr/>
<small>
If you have any questions, send us an email at opensourceillinois@gmail.com
</small>
`;

export default getEmailString;