<template>
    <div id="donate-button-container">
        <div id="donate-button"></div>
        <script src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js" charset="UTF-8"></script>
        <script>
            PayPal.Donation.Button({
                env:'production',
                hosted_button_id:'33D4VP5BKD9EN',
                image: {
                src:'https://www.paypalobjects.com/it_IT/IT/i/btn/btn_donate_LG.gif',
                alt:'Fai una donazione con il pulsante PayPal',
                title:'PayPal - The safer, easier way to pay online!',
                }
            }).render('#donate-button');
        </script>
    </div>

</template>