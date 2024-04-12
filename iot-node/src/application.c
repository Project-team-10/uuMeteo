#include <application.h>

#define TEMPERATURE_UPDATE_SERVICE_INTERVAL (5 * 1000)
#define TEMPERATURE_PUB_VALUE_CHANGE 0.5f
#define TEMPERATURE_PUB_NO_CHANGE_INTEVAL (60 * 60 * 1000)


// Thermometer instance
twr_tmp112_t tmp112;
static event_param_t temperature_event_param = {.next_pub = 0};


// buttton instance
twr_button_t  button;
uint16_t button_click_count = 0;

// Temp func
void tmp112_event_handler(twr_tmp112_t *self, twr_tmp112_event_t event, void *event_param)
{
    float value;
    event_param_t *param = (event_param_t *)event_param;

    if (event == TWR_TMP112_EVENT_UPDATE)
    {
        if(twr_tmp112_get_temperature_celsius(self, &value))
        {
            if ((fabsf(value - param->value) >= TEMPERATURE_PUB_VALUE_CHANGE) || (param->next_pub < twr_scheduler_get_spin_tick()))
            {
                twr_log_debug("Temperature is: %.2f", value);
                twr_radio_pub_temperature(param->channel, &value);

                param->value = value;
                param->next_pub = twr_scheduler_get_spin_tick() + TEMPERATURE_PUB_NO_CHANGE_INTEVAL;
            }  
        }
    }
}

// Button func
void button_event_handler(twr_button_t *self, twr_button_event_t event, void *event_param)
{
   if(event == TWR_BUTTON_EVENT_CLICK)
   {
    button_click_count++;

    twr_log_debug("Button Clicked");
    
    twr_radio_pub_push_button(&button_click_count);
   }
}


// Application initialization function which is called once after boot
void application_init(void)
{
    // Initialize logging
    twr_log_init(TWR_LOG_LEVEL_DUMP, TWR_LOG_TIMESTAMP_ABS);

    twr_log_info("App running .");

    // TEMP //

    // channel
    temperature_event_param.channel = TWR_RADIO_PUB_CHANNEL_R1_I2C0_ADDRESS_ALTERNATE;

    // init  temp
    twr_tmp112_init(&tmp112, TWR_I2C_I2C0, 0x49);
    twr_tmp112_set_event_handler(&tmp112, tmp112_event_handler, &temperature_event_param);

    // updating temp interval
    twr_tmp112_set_update_interval(&tmp112, TEMPERATURE_UPDATE_SERVICE_INTERVAL);


    // init button
    twr_button_init(&button, TWR_GPIO_BUTTON, TWR_GPIO_PULL_DOWN, 0);
    twr_button_set_event_handler(&button, button_event_handler, NULL);


    // RADIO //
    // Initialize radio
    twr_radio_init(TWR_RADIO_MODE_NODE_SLEEPING);
    // Send radio pairing request
    twr_radio_pairing_request("uuMeteo", FW_VERSION);
}

