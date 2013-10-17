<?php defined('SYSPATH') or die('No direct script access.');
/**
 * description...
 *
 * @author		Slobodan <slobodan.josifovic@gmail.com>
 * @package		OC
 * @copyright	(c) 2009-2013 Open Classifieds Team
 * @license		GPL v3
 * *
 */
class Model_Order extends ORM {


	/**
	 * Table name to use
	 *
	 * @access	protected
	 * @var		string	$_table_name default [singular model name]
	 */
	protected $_table_name = 'orders';

	/**
	 * Column to use as primary key
	 *
	 * @access	protected
	 * @var		string	$_primary_key default [id]
	 */
	protected $_primary_key = 'id_order';

	/**
	 * Status constants
	 */
    const STATUS_CREATED        = 0;   // just created
    const STATUS_PAID           = 1;   // paid!
    const STATUS_REFUSED        = 5;   //tried to paid but not succeed
    const STATUS_REFUND         = 99;  //we refunded the money

    /**
     * @var  array  Available statuses array
     */
    public static $statuses = array(
        self::STATUS_CREATED      =>  'Created',
        self::STATUS_PAID         =>  'Paid',
        self::STATUS_REFUSED      =>  'Refused',
        self::STATUS_REFUND       =>  'Refund',
    );


    public function exclude_fields()
    {
        return array('created','parent_deep','order');
    }
    

    public static function create_sale($id_order=NULL, Model_User $user, Model_Product $product, $token, $method = 'paypal')
    {
        $order = new Model_Order();

        //retrieve info for the item in DB
        $order = $order->where('id_order', '=', $id_order)
                       ->where('status', '=', Model_Product::STATUS_CREATED)
                       ->limit(1)->find();

        //order didnt exists probably cuz is paypal and we generate the order only once paid
        if (!$order->loaded())
        {
            $order->id_product  = $product->id_product;
            $order->id_user     = $user->id_user;
            $order->paymethod   = $method;
            $order->currency    = $product->currency;
            $order->amount      = $product->price;
            $order->ip_address  = ip2long(Request::$client_ip);
        }

        $order->txn_id      = $token;
        $order->license     = 'yyyymmdd-00000IDUSER-00000IDPROD';//kamaleon-20131017-2-2';//Core::post('payer_email').$product->id_product.$user->id_user;
        //$order->domain      = '';//empty on license verification we set the first domain they used@todo
        $order->pay_date    = Date::unix2mysql();
        $order->status      = Model_Order::STATUS_PAID;

        try {
            $order->save();

            //send email with order details download link and product notes 
            //@todo
            $user->email('new.sale',array( 

                                           '[URL.QL]'=>$user->ql('default',NULL,TRUE)
                                        )
                                );
        } 
        catch (Exception $e) 
        {
            Kohana::$log->add(Log::ERROR, 'Order failed on creation, but paid. '.Core::post('payer_email'));
            d($e);
        }

    }

}