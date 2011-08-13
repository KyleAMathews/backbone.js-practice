<?php

$data = json_encode($_POST['matches']);
file_put_contents("/tmp/temp", $data);
print $data;
