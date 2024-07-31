<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use app\Events\NotificationEvent;

class ReturnRequestNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */

     protected $requestForm;
     protected $status;

     protected $firstname;
     protected $approverFirstname;
     protected $approverLastname;
     protected $comment;
    public function __construct($requestForm, $status, $firstname,$approverFirstname,$approverLastname,$comment)
    {
        $this->requestForm = $requestForm;
        $this->status = $status;
        $this->firstname = $firstname;
        $this->approverFirstname =$approverFirstname;
        $this->approverLastname =$approverLastname;
        $this->comment=$comment;

    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail','database','broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $approvalUrl = route('view.single.request.form.for.approval', ['request_form_id' => $this->requestForm->id]);
                    return (new MailMessage)
                    ->view('emails.return_request',[
                        'requestForm' => $this->requestForm,
                        'firstname' =>$this->firstname,
                        'approvalUrl' => $approvalUrl,
                        'status' =>$this->status,
                        'approverFirstname' =>$this->approverFirstname,
                        'approverLastname' =>$this->approverLastname,
                        'comment' =>$this->comment


                        ])
                    ->subject('Request Form Update - '.$this->requestForm->form_type)
                    ->line('Your request has been returned because it is ' . $this->status)
                    ->line('Request Type: '.$this->requestForm->form_type)
                    ->line('Status:' . $this->status)
                    ->action('Notification Action', url('/'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $approvalUrl = route('view.single.request.form.for.approval', ['request_form_id' => $this->requestForm->id]);
        return [
            'message' => 'Your request has been returned because it is ' . $this->status . ' by '. $this->approverFirstname.' '. $this->approverLastname,
            'requestForm' => $this->requestForm->form_type,
            'status' => $this->status,
            'created_at' => now()->toDateTimeString(),
            'firstname' =>$this->firstname,
            'approvalUrl' => $approvalUrl,
            'approverFirstname' =>$this->approverFirstname,
            'approverLastname' =>$this->approverLastname,
            'comment' =>$this->comment
        ];
    }


   /*  public function toBroadcast($notifiable)
    {
        //broadcast(new NotificationEvent($this->toArray($notifiable)));
        return new BroadcastMessage([
            'message' => 'Your request has been returned because it is ' . $this->status,
            'form_type' => $this->requestForm->form_type,
            'status' => $this->status,
            'created_at' => now()->toDateTimeString(),
        ]);
    } */
}