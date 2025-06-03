document.addEventListener('DOMContentLoaded', () => {

    flag=0;
    const link = document.getElementById('changePassword');
    link.addEventListener('click', async function(event) {
        event.preventDefault();
        link.style.display="none";
        const newPasswordField = document.getElementById('h_newpassword');
        newPasswordField.style.display = 'block';
        const btn=document.getElementById('btn');
        flag=1;
        btn.innerText="Change Password";
       
    });
    const loginForm = document.getElementById('login');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent form from refreshing the page
        const btn=document.getElementById('btn');
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if(flag==1){
            const newPassword =  document.getElementById('h_newpassword').value;
            try {
                const response =  await fetch('/change-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password ,newPassword}),
                });
    
                const result =await response.json();
    
                if (response.ok) {
                    // Login successful, redirect to the admin page
                    alert(result.message);
                    window.location.href = result.redirectUrl;
                } else {
                    // Login failed, show an alert
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error during change Password:', error);
                alert('An error occurred. Please try again.');
            }


        }
        else{
           
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    // Login successful, redirect to the admin page
                    alert(result.message);
                    window.location.href = result.redirectUrl;
                } else {
                    // Login failed, show an alert
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred. Please try again.');
            }

        }
     
    });
});